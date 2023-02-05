// Controller for Comment methods

const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

const async = require('async');
const { body, validationResult } = require('express-validator');


// GET Comment details by ID
exports.comment_detail = (req, res, next) => {
  Comment.findOne({ _id: req.params.comment })
    .exec((err, comment) => {
      if (err) { return next(err) };
      res.json({ comment })
    });
};

// Creates a new Comment on POST
exports.create_comment = [
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please write a comment before attempting to submit')
    .isLength({ max: 500 })
    .withMessage('Comments may not exceed 500 characters'),

  // Process request after validation
  (req, res, next) => {
    async.parallel({
      post(callback) {
        Post.findOne({ _id: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      const errors = validationResult(req);

      const comment = new Comment({
        content: req.body.content,
        date: new Date(),
        author: req.body.userID,
        by_guest: req.body.byGuest,
        parent_post: req.params.id,
        likes: 0,
      });

      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
        });
      };

      comment.save((err) => {
        if (err) { return next(err) };
        res.json({
          message: 'Successful'
        });
      });

      const old = results.post.comments;
      const updated = [...old, comment._id];
      Post.findByIdAndUpdate(req.params.id, { comments: updated }, (err) => {
        if (err) { return res.json({ message: 'Error' }) };
      });
    });
  },
];


// DELETE a comment
exports.delete_comment = (req, res, next) => {
  async.parallel({
    likes(callback) {
      Like.find({ comment: req.params.comment }).exec(callback);
    },
    posts(callback) {
      Post.findOne({ _id: req.params.id }).exec(callback);
    }
  },
  (err, results) => {
    if (err) { return next(err) };

    const like_list = results.likes.map(x => x._id);
    for (const like of like_list) {
      Like.findByIdAndRemove(like, (err) => {
        if (err) { return next(err) }
      });
    };

    const postComments = results.posts.comments;
    const index = postComments.indexOf(req.params.id);
    postComments.splice(index, 1);
    Post.findByIdAndUpdate(req.params.id, { comments: postComments }, (err) => {
      if (err) { return next(err) };
    });

    Comment.findByIdAndRemove(req.params.comment, (err) => {
      if (err) { return next(err) }
      return res.json({ message: 'Deleted' });
    });
  },
)};
