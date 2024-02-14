const AsyncHandler = require('express-async-handler');
const Group_Model = require('../models/group_model');
const { validationResult } = require('express-validator');

exports.get_groups = [
  AsyncHandler(async (req, res, next) => {
    try {
      const user_groups = await Group_Model.find({
        members: req.user.id,
      })
        .populate('members', 'username')
        .populate('admin', 'username')
        .exec();
      res.json(user_groups);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.get_group = [
  AsyncHandler(async (req, res, next) => {
    try {
      const group = await Group_Model.findById(req.params.id)
        .populate('members', 'username')
        .populate('admin', 'username')
        .exec();
      res.json(group);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.post_group = [
  AsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ errors: errors.array.map((err) => err.msg) });
    try {
      const newGroup = new Group_Model({
        name: req.body.name,
        message: req.body.message ? req.body.message : 'Welcome',
        admin: req.body.admin,
        members: JSON.parse(req.body.members),
        profile_pic_url: req.body.profile_pic_url
          ? req.body.profile_pic_url
          : '',
      });

      await newGroup.save();

      res.json(newGroup);
    } catch (e) {
      return next(e);
    }
  }),
];

/*
const GroupSchema = new Schema({
  name: { type: String, default: 'group', require: true },
  message: { type: String, default: 'new group' },
  admin: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  profile_pic_url: { type: String, default: '' },
  created_at: { type: Date, default: Date.now() },
});
*/

exports.update_group = [
  // add admin check middleware to make sure you are admin of the group
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'updated group' });
  }),
];

exports.add_group_member = [
  // add admin check middleware to make sure you are admin of the group
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'added member' });
  }),
];

exports.remove_group_member = [
  // add admin check middleware to make sure you are admin of the group
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'removed member' });
  }),
];

exports.delete_group = [
  AsyncHandler(async (req, res, next) => {
    // add admin check middleware to make sure you are admin of the group
    const deletedGroup = await Group_Model.findByIdAndDelete(req.params.id);

    // delete all the messages that have the group id as their associated group
    res.json({ data: 'deleted group' });
  }),
];
