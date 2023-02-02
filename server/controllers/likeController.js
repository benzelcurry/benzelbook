// Controller for Like (upvote) methods

const Like = require('../models/like');
const Post = require('../models/post');

const async = require('async');


// Creates a new like or removes an old one
exports.add_like = (req, res, next) => {
  async.parallel({
    like(callback) {
      Like.findOne({ post: req.params.id, user: req.body.userID }).exec(callback)
    },
    post(callback) {
      Post.findOne({ _id: req.params.id }).exec(callback);
    },
  },
  (err, results) => {
    if (results.like) {
      const likes = results.post.likes;
      Post.findByIdAndUpdate(req.params.id, { likes: (likes - 1) }, (err) => {
        if (err) { return res.json({ message: 'Error' }) };
      });

      return Like.findByIdAndRemove(results.like._id, (err) => {
          if (err) { return res.json({ message: 'Error' }) };
          res.json({ message: 'Removed' });
          });
    };

    const likes = results.post.likes;
    Post.findByIdAndUpdate(req.params.id, { likes: (likes + 1) }, (err) => {
      if (err) { return res.json({ message: 'Error' }) };
    });

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