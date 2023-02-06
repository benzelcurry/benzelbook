// Routing module for HTTP requests

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Require controller modules
const user_controller = require('../controllers/userController');
const post_controller = require('../controllers/postController');
const like_controller = require('../controllers/likeController');
const request_controller = require('../controllers/requestController');
const comment_controller = require('../controllers/commentController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  };
};

let upload = multer({ storage, fileFilter});

///// NON-SPECIFIC ROUTES ///// 

// Maintains persistent user verification across site
router.post('/', (req, res) => {
  if (req.body.token) {
    const decrypt = jwt.verify(req.body.token, process.env.SECRET_KEY);
    res.json({
      // MIGHT NEED TO UPDATE TO SEND PFP DATA
      username: decrypt.username,
      name: `${decrypt.first_name} ${decrypt.family_name}`,
      id: decrypt.id,
    });
  } else {
    res.json('No current user.');
  };
});

// Logs user in on POST
router.post('/login', user_controller.login_user);

// Logs guest in on POST
router.post('/login/guest', user_controller.guest_login);

// Return profile picture on GET
router.get('/images/:id', (req, res) => {
  const filePath = `../server/images/${req.params.id}`;
  const resolvedPath = path.resolve(filePath);
  res.sendFile(resolvedPath);
});


///// USER ROUTES /////

// GET list of users
router.get('/users', user_controller.user_list);

// POST create new user
router.post('/users', upload.single('pfp'), user_controller.create_user);

// Adds to User friend list on PUT
router.put('/users/:id/friends', user_controller.add_friends);

// Deletes from User friend list and updates on PUT
router.put('/users/:id/friends/delete', user_controller.delete_friends);

// GET details for a single user by ID
router.get('/users/id/:id', user_controller.userID_detail);

// GET details for a single user
router.get('/users/:username', user_controller.user_detail);


///// (USER-MADE) POST & COMMENT ROUTES /////

// GET list of posts
router.get('/posts', post_controller.post_list);

// Create new post on POST
router.post('/posts', post_controller.create_post);

// Return post details on GET
router.get('/posts/:id', post_controller.get_details);

// DELETE Post
router.delete('/posts/:id', post_controller.delete_post);

// Create new Post Comment on POST
router.post('/posts/:id/comments', comment_controller.create_comment);

// GET Comment details
router.get('/posts/:id/comments/:comment', comment_controller.comment_detail);

// DELETE Comment
router.delete('/posts/:id/comments/:comment', comment_controller.delete_comment);

// Create new like or removes an old one on a post on POST
router.post('/posts/:id', like_controller.add_like);


///// FRIEND REQUEST ROUTES /////

// GET list of Friend Requests
router.get('/requests', request_controller.request_list);

// Create new Friend Request on POST
router.post('/requests', request_controller.create_request);

// Cancel a pending Friend Request on DELETE
router.delete('/requests/:id', request_controller.delete_request);

module.exports = router;