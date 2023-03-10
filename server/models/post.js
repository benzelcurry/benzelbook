// Post model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const PostSchema = new Schema({
  content: { type: String, required: true, minLength: 1, maxLength: 1000 },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  target: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  by_guest: { type: Boolean },
  likes: { type: Number },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

PostSchema.virtual('url').get(function() {
  return `/posts/${this._id}`;
});

PostSchema.virtual('date_formatted').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Post', PostSchema);