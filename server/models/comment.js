// Comment (responses to posts) model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const CommentSchema = new Schema({
  content: { type: String, required: true, minLength: 1, maxLength: 500 },
  date: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent_post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  likes: { type: Number, required: true },
});

CommentSchema.virtual('date_formatted').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Comment', CommentSchema);