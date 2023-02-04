// Controller for Like (upvote) methods

const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

const async = require('async');


// Creates a new like or removes an old one
exports.add_like = (req, res, next) => {
  async.parallel({
    post_like(callback) {
      Like
        .findOne({ post: req.params.id, user: req.body.userID })
        .exec(callback)
    },
    comment_like(callback) {
      Like
        .findOne({ comment: req.params.id, user: req.body.userID })
        .exec(callback)
    },
    post(callback) {
      Post.findOne({ _id: req.params.id }).exec(callback);
    },
    comment(callback) {
      Comment.findOne({ _id: req.params.id }).exec(callback);
    },
  },
  (err, results) => {
    if (results.post_like || results.comment_like) {
      if (results.post) {
        const likes = results.post.likes;
        Post.findByIdAndUpdate(req.params.id, { likes: (likes - 1) }, (err) => {
          if (err) { return res.json({ message: 'Error' }) };
        });
      } else if (results.comment) {
        const likes = results.comment.likes;
        Comment.findByIdAndUpdate(req.params.id, { likes: (likes - 1) }, (err) => {
          if (err) { return res.json({ message: 'Error' }) };
        });
      };

      // Deletes like if it's for a post
      if (results.post_like) {
        return Like.findByIdAndRemove(results.post_like._id, (err) => {
            if (err) { return res.json({ message: 'Error' }) };
            res.json({ message: 'Removed' });
            });
      // Deletes like if it's for a comment
      } else if (results.comment_like) {
        return Like.findByIdAndRemove(results.comment_like._id, (err) => {
          if (err) { return res.json({ message: 'Error' }) };
          res.json({ message: 'Removed' });
          });
      }
    };

    // Saves like to post
    if (results.post) {
      const likes = results.post.likes;
      Post.findByIdAndUpdate(req.params.id, { likes: (likes + 1) }, (err) => {
        if (err) { return res.json({ message: 'Error' }) };
      });
      const like = new Like({
        user: req.body.userID,
        post: req.params.id,
      });
  
      like.save((err) => {
        if (err) { return next(err) };
        res.json({ message: 'Successful' });
      });
    // Saves like to comment
    } else if (results.comment) {
      const likes = results.comment.likes;
      Comment.findByIdAndUpdate(req.params.id, { likes: (likes + 1) }, (err) => {
        if (err) { return res.json({ message: 'Error' }) };
      });

      const like = new Like({
        user: req.body.userID,
        comment: req.params.id,
      });
  
      like.save((err) => {
        if (err) { return next(err) };
        res.json({ message: 'Successful' });
      });
    };
  });
};