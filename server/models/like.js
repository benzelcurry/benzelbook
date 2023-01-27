// Like (upvotes for posts) model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: false },
  comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: false },
});

module.exports = mongoose.model('Like', LikeSchema);