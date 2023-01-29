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


// Creates a new like or removes an old one
exports.add_like = (req, res, next) => {
  async.parallel({
    like(callback) {
      Like.findOne({ post: req.params.id, user: req.body.userID }).exec(callback)
    },
  },
  (err, results) => {
    if (results.like) {
      return Like.findByIdAndRemove(results.like._id, (err) => {
        if (err) { return res.json({ message: 'Error' }) };
        res.json({ message: 'Removed' });
      });
    };

    const like = new Like({
      user: req.body.userID,
      post: req.params.id,
      comment: req.body.commentID,
    });

    like.save((err) => {
      if (err) { return next(err) };
      res.json({ message: 'Successful' });
    });
  });
};