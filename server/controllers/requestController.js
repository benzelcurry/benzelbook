// Controller for Friend Request methods

const FriendRequest = require('../models/friendRequest');

const async = require('async');

// GET list of friend requests
exports.request_list = (req, res, next) => {
  FriendRequest.find().exec((err, list_requests) => {
    if (err) { return next(err) };
    const requests = list_requests.map((request) => ({
      from: request.from,
      to: request.to,
      id: request._id,
    }));

    res.json({ request_list: requests });
  });
};


// Create new Friend Request on POST
exports.create_request = (req, res, next) => {
  const request = new FriendRequest({
    from: req.body.userID,
    to: req.body.pageID,
    date: new Date(),
  });

  request.save((err) => {
    if (err) { return next(err) };
    res.json({ message: 'Success' });
  });
};


// Cancel pending Friend Request on DELETE
exports.delete_request = (req, res, next) => {
  FriendRequest.findByIdAndRemove(req.params.id, (err) => {
    if (err) { return res.json({ message: 'Error' }) };
    return res.json({ message: 'Success' });
  });
};