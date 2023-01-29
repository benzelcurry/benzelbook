// Controller for Like (upvote) methods

const Like = require('../models/like');

const async = require('async');
const { body, validationResult } = require('express-validator');

// Creates a new like
exports.add_like = (req, res, next) => {
  const like = new Like({
    user: req.body.userID,
    post: req.body.postID,
    comment: req.body.commentID,
  });

  like.save((err) => {
    if (err) { return next(err) };
    res.json({
      message: 'Successful',
    });
  });
};

// ADD A CONTROLLER METHOD FOR REMOVING LIKES