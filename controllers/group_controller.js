const AsyncHandler = require('express-async-handler');
const Group_Model = require('../models/group_model');
const { validationResult } = require('express-validator');
const user_model = require('../models/user_model');

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
      return res.json({ errors: errors.array().map((err) => err.msg) });

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
    // update the name, message and profile_pic_url if provided
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array.map((err) => err.msg) });
    }

    try {
      const groupData = {};

      if (req.body.name) groupData.name = req.body.name;
      if (req.body.message) groupData.message = req.body.message;
      if (req.body.profile_pic_url)
        groupData.profile_pic_url = req.body.profile_pic_url;

      const updatedGroup = await Group_Model.findByIdAndUpdate(
        req.params.id,
        groupData,
        { new: true }
      );

      if (!updatedGroup) {
        return res.status(404).json({ errors: ['Group not found'] });
      }

      res.json(updatedGroup);
    } catch (error) {
      next(error);
    }
  }),
];

exports.add_group_member = [
  // add admin check middleware to make sure you are admin of the group
  AsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }

    try {
      const newMember = await user_model.findById(req.body.member).exec();

      if (!newMember)
        return res.status(404).json({ errors: ['User not found'] });

      const groupData = await Group_Model.findById(req.params.id).exec();

      if (!groupData)
        return res.status(404).json({ errors: ['Group not found'] });

      if (groupData.members.includes(req.body.member))
        return res
          .status(404)
          .json({ errors: ['User already a group member'] });

      groupData.members.push(req.body.member);

      await groupData.save();

      res.json(groupData);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.remove_group_member = [
  // add admin check middleware to make sure you are admin of the group
  AsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }

    try {
      const memberToRemove = await user_model.findById(req.body.member).exec();

      if (!memberToRemove)
        return res.status(404).json({ errors: ['User not found'] });

      const groupData = await Group_Model.findById(req.params.id).exec();

      if (!groupData)
        return res.status(404).json({ errors: ['Group not found'] });

      if (!groupData.members.includes(req.body.member))
        return res.status(404).json({ errors: ['User not a group member'] });

      if (groupData.admin == req.body.member) {
        return res
          .status(404)
          .json({ errors: ['Cannot remove admin from group'] });
      }

      const newMembers = groupData.members.filter(
        (id) => id != req.body.member
      );
      groupData.members = newMembers;

      await groupData.save();

      res.json(groupData);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.replace_admin = [
  AsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }

    try {
      const groupData = await Group_Model.findById(req.params.id).exec();
      if (!groupData)
        return res.status(404).json({ errors: ['Group not found'] });

      if (groupData.admin == req.body.admin)
        return res
          .status(404)
          .json({ errors: ['New admin is already the admin'] });

      const newAdmin = await user_model.findById(req.body.admin).exec();
      if (!newAdmin)
        return res.status(404).json({ errors: ['New admin not a valid user'] });

      if (!groupData.members.includes(req.body.admin))
        return res
          .status(404)
          .json({ errors: ['New admin not a group member'] });

      groupData.admin = req.body.admin;
      await groupData.save();
      res.json(groupData);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.delete_group = [
  AsyncHandler(async (req, res, next) => {
    // add admin check middleware to make sure you are admin of the group
    const deletedGroup = await Group_Model.findByIdAndDelete(req.params.id);

    if (!deletedGroup)
      return res.status(404).json({ errors: ['Group does not exist'] });
    // delete all the messages that have the group id as their associated group
    res.json(deletedGroup);
  }),
];
