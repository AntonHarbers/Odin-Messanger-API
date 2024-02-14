const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const GroupSchema = new Schema({
  name: { type: String, default: 'group', required: true },
  message: { type: String, default: 'new group' },
  admin: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  profile_pic_url: { type: String, default: '' },
  created_at: { type: Date, default: Date.now() },
});

GroupSchema.virtual('url').get(function () {
  return `/groups/${this._id}`;
});

GroupSchema.virtual('created_at_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Group', GroupSchema);
