// Routing module for HTTP requests

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json('Welcome to Odinbook!');
});

module.exports = router;