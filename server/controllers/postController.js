// Controller for (user-made) Post methods

const Post = require('../models/post');

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
      author: req.body.userID,
      likes: 0,
    });

    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    post.save((err) => {
      if (err) { return next(err) };
      res.json('Post successfully created.');
    });
  },
];