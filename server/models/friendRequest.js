const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

// WILL WANT TO DELETE FRIEND REQUESTS FROM DB UPON ACCEPTANCE

const frSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
});

frSchema.virtual('date_formatted').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('FriendRequest', frSchema);