// Controller for Friend Request methods

const FriendRequest = require('../models/friendRequest');

const async = require('async');

// Create new Friend Request on POST
exports.create_request = (req, res, next) => {
  const request = new FriendRequest({
    from: req.body.userID,
    to: req.body.pageID,
    date: new Date(),
  });

  request.save((err) => {
    if (err) { return next(err) };
    res.json('Success');
  });
};