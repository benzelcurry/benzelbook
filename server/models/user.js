// User model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const UserSchema = new Schema({
  first_name: { type: String, required: true, minLength: 1, maxLength: 20 },
  family_name: { type: String, required: true, minLength: 1, maxLength: 20 },
  username: { type: String, required: true, minLength: 3, maxLength: 16 },
  password: { type: String, required: true, minLength: 6, maxLength: 100 },
  account_created: { type: Date, required: true },
  // Friends field might need updating; not sure if this will work
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

UserSchema.virtual('url').get(function() {
  return `/users/${this.username}`;
});

UserSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.family_name}`;
});

UserSchema.virtual('date_formatted').get(function() {
  return DateTime.fromJSDate(this.account_created).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('User', UserSchema);