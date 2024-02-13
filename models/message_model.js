const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const MessageSchema = new Schema({
  content: { type: String, default: 'new group' },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  created_at: { type: Date, default: Date.now() },
});

MessageSchema.virtual('url').get(function () {
  return `/messages/${this._id}`;
});

MessageSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Message', MessageSchema);
