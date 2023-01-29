// Controller for Like (upvote) methods

const Like = require('../models/like');

const async = require('async');
const { body, validationResult } = require('express-validator');


// GET amount of likes on a post
exports.get_likes = (req, res, next) => {
  Like.find({ post: req.params.id })
    .exec((err, total_likes) => {
      if (err) { return next(err) };
      res.json({ total_likes: total_likes.length });
    });
};


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