const AsyncHandler = require('express-async-handler');
const Group_Model = require('../models/group_model');
const user_model = require('../models/user_model');
const validationResultHandling = require('../middleware/validationResultHandling');
const { default: mongoose } = require('mongoose');
const message_model = require('../models/message_model');
const group_model = require('../models/group_model');

exports.get_groups = [
  AsyncHandler(async (req, res, next) => {
    try {
      const user_groups = await Group_Model.find({
        members: req.user.id,
      })
        .populate('members', 'username profile_pic_url')
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
      const group = await Group_Model.findById(req.params.id).exec();

      if (!group.members.includes(req.user.id))
        return res
          .status(404)
          .json({ errors: ['User not member of this group'] });

      res.json(group);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.post_group = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    console.log(req.body);
    try {
      const newGroup = new Group_Model({
        name: req.body.name,
        message: req.body.message ? req.body.message : 'Welcome',
        admin: req.body.admin,
        members: req.body.members,
        profile_pic_url: req.body.profile_pic_url
          ? req.body.profile_pic_url
          : '',
      });

      await newGroup.save();
      await newGroup.populate(
        'members admin',
        'username email profile_pic_url'
      );

      res.json(newGroup);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }),
];

exports.update_group = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    // update the name, message and profile_pic_url if provided
    try {
      if (req.body.name) req.group.name = req.body.name;
      if (req.body.message) req.group.message = req.body.message;
      if (req.body.profile_pic_url)
        req.group.profile_pic_url = req.body.profile_pic_url;
      await req.group.save();
      await req.group.populate(
        'members admin',
        'username email profile_pic_url'
      );

      res.json(req.group);
    } catch (error) {
      next(error);
    }
  }),
];

exports.add_group_member = [
  // add admin check middleware to make sure you are admin of the group
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    try {
      const newMember = await user_model.findById(req.body.member).exec();

      if (!newMember)
        return res.status(404).json({ errors: ['User not found'] });

      if (req.group.members.includes(req.body.member))
        return res
          .status(404)
          .json({ errors: ['User already a group member'] });

      req.group.members.push(req.body.member);

      await req.group.save();
      await req.group.populate(
        'admin members',
        'username email profile_pic_url'
      );
      res.json(req.group);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.remove_group_member = [
  // add admin check middleware to make sure you are admin of the group
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    try {
      const memberToRemove = await user_model.findById(req.body.member).exec();

      if (!memberToRemove)
        return res.status(404).json({ errors: ['User not found'] });

      if (!req.group.members.includes(req.body.member))
        return res.status(404).json({ errors: ['User not a group member'] });

      if (req.group.admin == req.body.member) {
        return res
          .status(404)
          .json({ errors: ['Cannot remove admin from group'] });
      }

      const newMembers = req.group.members.filter(
        (id) => id != req.body.member
      );
      req.group.members = newMembers;

      await req.group.save();
      await req.group.populate(
        'members admin',
        'username email profile_pic_url'
      );

      res.json(req.group);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.replace_admin = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    try {
      if (req.group.admin == req.body.admin)
        return res
          .status(404)
          .json({ errors: ['New admin is already the admin'] });

      const newAdmin = await user_model.findById(req.body.admin).exec();
      if (!newAdmin)
        return res.status(404).json({ errors: ['New admin not a valid user'] });

      if (!req.group.members.includes(req.body.admin))
        return res
          .status(404)
          .json({ errors: ['New admin not a group member'] });

      req.group.admin = req.body.admin;
      await req.group.save();
      res.json(req.group);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.delete_all_groups = AsyncHandler(async (req, res, next) => {
  await group_model.deleteMany({}).exec();
  res.json('ok');
});

exports.delete_group = [
  AsyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await message_model
        .deleteMany({ group: req.params.id }, { session })
        .exec();

      const deletedGroup = await Group_Model.findByIdAndDelete(req.params.id, {
        session,
      }).exec();

      await session.commitTransaction();
      res.json({
        message: 'Group and group message data succesfully deleted',
        deleted_group: deletedGroup,
      });
    } catch (e) {
      await session.abortTransaction();
      return next(e);
    } finally {
      session.endSession();
    }
    // delete all messages that correspond to this group_id

    res.json(deletedGroup);
  }),
];
