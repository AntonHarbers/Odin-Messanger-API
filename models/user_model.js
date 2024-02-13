const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const UserSchema = new Schema({
  email: { type: String, default: 'new group' },
  password: { type: String, required: true },
  username: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  profile_pic_url: { type: String, default: '' },
});

UserSchema.virtual('url').get(function () {
  return `/users/${this._id}`;
});

UserSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('User', UserSchema);
