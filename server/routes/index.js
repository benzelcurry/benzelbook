// Routing module for HTTP requests

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Require controller modules
const user_controller = require('../controllers/userController');
const post_controller = require('../controllers/postController');
const like_controller = require('../controllers/likeController');


///// NON-SPECIFIC ROUTES ///// 

router.get('/', (req, res) => {
  res.json('Welcome to Odinbook!');
});

router.post('/', (req, res) => {
  if (req.body.token) {
    const decrypt = jwt.verify(req.body.token, process.env.SECRET_KEY);
    res.json({
      username: decrypt.username,
      name: `${decrypt.first_name} ${decrypt.family_name}`,
      id: decrypt.id,
    });
  } else {
    res.json('No current user.');
  };
});

router.post('/login', user_controller.login_user);


///// USER ROUTES /////

// GET list of users
router.get('/users', user_controller.user_list);

// POST create new user
router.post('/users', user_controller.create_user);

// GET details for a single user by ID
router.get('/users/id/:id', user_controller.userID_detail);

// GET details for a single user
router.get('/users/:username', user_controller.user_detail);

///// (USER-MADE) POST ROUTES /////

// GET list of posts
router.get('/posts', post_controller.post_list);

// Create new post on POST
router.post('/posts', post_controller.create_post);

// Create new like on a post on POST
router.post('/posts/like', like_controller.add_like);

module.exports = router;