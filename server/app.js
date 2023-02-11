// Main entry point for server

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const indexRouter = require('./routes/index');

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

// app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use(helmet({}));
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('images'));
app.use(bodyParser.json());

app.use('/', indexRouter);

app.listen(process.env.PORT, () => console.log(`Listening on Port ${process.env.PORT}!`));