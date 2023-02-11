// Controller for (user-made) Post methods

const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Return list of all blog posts
exports.post_list = function (req, res, next) {
  Post.find()
    .sort([['date', 'descending']])
    .exec(function (err, list_posts) {
      if (err) { return next(err) };
      res.json({ post_list: list_posts });
    });
};

// GET details for a post
exports.get_details = (req, res, next) => {
  Post.find({ _id: req.params.id })
    .exec((err, post) => {
      if (err) { return next(err) };
      res.json({ post });
    });
};

// Create a post on POST
exports.create_post = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please write a post before attempting to submit')
    .isLength({ max: 1000 })
    .withMessage('Posts must be under 1000 characters'),

  // Process request after validation
  (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      content: req.body.content,
      date: new Date(),
      by_guest: req.body.byGuest,
      author: req.body.userID,
      target: req.body.targetID,
      likes: 0,
    });

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    post.save((err) => {
      if (err) { return next(err) };
      res.json({
        message: 'Successful'
      });
    });
  },
];

// DELETE a post
exports.delete_post = (req, res, next) => {
  async.parallel({
    comments(callback) {
      Comment.find({ parent_post: req.params.id }).exec(callback);
    },
    likes(callback) {
      Like.find().exec(callback);
    },
  },
  (err, results) => {
    if (err) { return next(err) };

    const likes = results.likes;
    const comment_list = results.comments.map(x => x._id);
    const comment_likes = [];
    
    // Pulls comment like IDs for deletion
    for (const item of comment_list) {
      const like = likes.find(obj => String(obj.comment) === String(item));
      if (like) {
        comment_likes.push(like._id) 
      }
    }

    // Pulls post like IDs for deletion
    const post_likes = [];
    for (const like of likes) {
      if (String(like.post) === String(req.params.id)) {
        post_likes.push(like._id)
      }
    };

    // Deletes post's comments' likes
    for (const like of comment_likes) {
      Like.findByIdAndRemove(like, (err) => {
        if (err) { return next(err) };
      });
    };

    // Deletes post's comments
    for (const comment of comment_list) {
      Comment.findByIdAndRemove(comment, (err) => {
        if (err) { return next(err) };
      });
    };

    // Deletes post's likes
    for (const like of post_likes) {
      Like.findByIdAndRemove(like, (err) => {
        if (err) { return next(err) };
      });
    };

    // Deletes post
    Post.findByIdAndRemove(req.params.id, (err) => {
      if (err) { return next(err) };
      return res.json({ message: 'Deleted' });
    });
  },
)};