// Controller for User methods

const User = require('../models/user');

const { body, validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Return list of Users on GET
exports.user_list = (req, res, next) => {
  User.find()
    .sort([['username', 'ascending']])
    .exec((err, list_users) => {
      if (err) { return next(err) };
      // WILL NEED TO UPDATE TO RETURN PROFILE PIC INFO
      const users = list_users.map((user) => ({ 
        username: user.username,
        first_name: user.first_name,
        family_name: user.family_name,
        account_created: user.account_created,
        pfp: user.pfp,
        id: user._id,
      }));

      res.json({ user_list: users });
    });
};


// Return details of single User on GET
exports.user_detail = (req, res, next) => {
  if (req.params.username === 'guestuser') {
    return res.json({
      username: 'guestuser',
      first_name: 'Guest',
      family_name: 'User',
      id: 'guestuser123',
    });
  } else {
    User.findOne({ username: req.params.username })
      .exec((err, user) => {
        if (err) { return next(err) };
        res.json({ user })
      });
  }
};


// Look up user by ID and return details on GET
exports.userID_detail = (req, res, next) => {
  if (req.params.id === 'guestuser123') {
    return res.json({
      username: 'guestuser',
      first_name: 'Guest',
      family_name: 'User',
      id: 'guestuser123',
    });
  } else {
    User.findOne({ _id: req.params.id })
      .exec((err, user) => {
        if (err) { return next(err) };
        // WILL NEED TO UPDATE TO RETURN PROFILE PIC INFO
        res.json({
          username: user.username,
          first_name: user.first_name,
          family_name: user.family_name,
          pfp: user.pfp,
          account_created: user.account_created,
          friends: user.friends,
          id: user._id,
        });
      });
  }
};


// Create new user on POST
exports.create_user = [
  // Validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a first name')
    .isLength({ max: 20 })
    .withMessage('First name must be 20 characters or less'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a family name')
    .isLength({ max: 20 })
    .withMessage('Family name must be 20 characters or less'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .isLength({ max: 16 })
    .withMessage('Username must be 16 characters or less')
    .isAlphanumeric()
    .withMessage('Usernames may only contain alphanumeric characters')
    .custom((value) => value !== '404' && value !== 'guestuser')
    .withMessage('Please choose a different username'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 100 })
    .withMessage('Password must not exceed 100 characters'),
  body('confirm_password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password confirmation field must not be empty')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),

  // Process request after validation
  (req, res, next) => {
    async.parallel({
      user(callback) {
        User.findOne({ username: req.body.username }).exec(callback);
      },
    },
    (err, results) => {
      if (results.user) {
        return res.json({
          errors: ['Username already exists']
        });
      };

      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return next(err) };

        const errors = validationResult(req);

        if (!req.file) {
          const user = new User({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            username: req.body.username,
            password: hashedPassword,
            account_created: new Date(),
          });
  
          if (!errors.isEmpty()) {
            return res.json({
              errors: errors.array(),
            });
          };
  
          user.save((err) => {
            if (err) { return next(err) };
            res.json('Account successfully created.');
          });
        } else {
          const user = new User({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            username: req.body.username,
            password: hashedPassword,
            pfp: req.file.filename,
            account_created: new Date(),
          });

          if (!errors.isEmpty()) {
            return res.json({
              errors: errors.array(),
            });
          };

          user.save((err) => {
            if (err) { return next(err) };
            res.json('Account successfully created.');
          });
        };
      });
    });
  },
];


// Update profile picture on PUT
exports.update_pfp = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) { return next(err) };

      User.findByIdAndUpdate(req.params.id, { pfp: req.file.filename }, (err) => {
        if (err) return next(err);
        return res.json({ message: 'Success' });
      });
    });
};


// Update User about section on PUT
exports.update_about = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) { return next(err) };

      User.findByIdAndUpdate(req.params.id, { about: req.body.about }, (err) => {
        if (err) return next(err);
        return res.json({ message: 'Success' });
      });
    });
};


// Log user in on POST
exports.login_user = (req, res, next) => {
  async.parallel(
    {
      user(callback) {
        User.findOne({ username: req.body.username }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        // Error in API usage
        return next(err);
      };
      if (!results.user) {
        // No user with matching username found
        return res.json({
          error: 'Username does not exist'
        });
      };
      bcrypt.compare(req.body.password, results.user.password, (err, isValid) => {
        if (isValid) {
          const secret = process.env.SECRET_KEY;
          const token = jwt.sign(
            {
              username: req.body.username,
              first_name: results.user.first_name,
              family_name: results.user.family_name,
              pfp: results.user.pfp,
              id: results.user._id,
            },
            secret,
            { expiresIn: '30d' },
          );

          // MIGHT WANT TO COME BACK AND DELETE COOKIE SINCE CAN'T SERVE FROM DIF DOMAINS
          res.cookie('token', token, { secure: false, httpOnly: true });

          return res.status(200).json({
            message: 'Successful',
            admin: results.user.admin,
            token,
          });
        } else {
          return res.json({
            error: 'Incorrect password'
          });
        };
      });
    },
  );
};


// Logs guest in on POST
exports.guest_login = (req, res, next) => {
  const secret = process.env.SECRET_KEY;
  const token = jwt.sign(
    {
      username: 'guestuser',
      first_name: 'Guest',
      family_name: 'User',
      id: 'guestuser123',
    },
    secret,
    { expiresIn: '30d' },
  );

  res.cookie('token', token, { secure: false, httpOnly: true });

  return res.status(200).json({
    message: 'Successful',
    token,
  });
};


// Add friend to User on PUT
exports.add_friends = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if(err) { return next(err) }

      if (user.friends.includes(req.body.friend)) {
        return res.json({
          message: 'Users are already friends.'
        });
      };

      const old = user.friends;
      const updated = [...old, req.body.friend];
      
      User.findByIdAndUpdate(req.params.id, { friends: updated }, (err) => {
        if (err) return next(err);
        return res.json({ message: 'Success' });
      });
    });
};


// Delete friend from User on PUT
exports.delete_friends = (req, res, next) => {
  User.findById(req.params.id)
    .exec((err, user) => {
      if (err) { return next(err) }

      const friendArr = user.friends;
      const index = friendArr.indexOf(req.body.friend);
      
      if (index > -1) {
        friendArr.splice(index, 1);
        User.findByIdAndUpdate(req.params.id, { friends: friendArr }, (err) => {
          if (err) return next(err);
          return res.json({ message: 'Success' });
        });
      };
    });
};