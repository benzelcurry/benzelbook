const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('Hello, World!');
});

app.listen(process.env.PORT, () => console.log(`Listening on Port ${process.env.PORT}!`));