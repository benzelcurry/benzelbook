// Routing module for HTTP requests

const express = require('express');
const router = express.Router();

// Require controller modules
const user_controller = require('../controllers/userController');

router.get('/', (req, res) => {
  res.json('Welcome to Odinbook!');
});


///// USER ROUTES /////

// GET list of users
router.get('/users', user_controller.user_list);

module.exports = router;