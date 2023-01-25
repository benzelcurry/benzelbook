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