const AsyncHandler = require('express-async-handler');
const message_model = require('../models/message_model');
const group_model = require('../models/group_model');
const { validationResult } = require('express-validator');
const validationResultHandling = require('../middleware/validationResultHandling');

exports.get_messages = [
  AsyncHandler(async (req, res, next) => {
    try {
      const messages = await message_model
        .find({})
        .populate('group', 'name')
        .exec();

      res.json(messages);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.get_group_messages = [
  AsyncHandler(async (req, res, next) => {
    try {
      const group = await group_model.findById(req.params.group).exec();

      if (!group)
        return res.status(404).json({ errors: ['Group does not exist'] });

      if (!group.members.includes(req.user.id))
        return res.status(404).json({ errors: ['User not in this group'] });

      const groupMessages = await message_model.find({
        group: req.params.group,
      });
      res.json({ groupMessages });
    } catch (e) {
      return next(e);
    }
  }),
];

exports.post_message = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    try {
      const group = await group_model.findById(req.body.group).exec();

      if (!group)
        return res.status(404).json({ errors: ['Group does not exist'] });

      if (!group.members.includes(req.user.id))
        return res.status(404).json({ errors: ['User not in this group'] });

      const newMessage = new message_model({
        content: req.body.content,
        sender: req.user.id,
        group: req.body.group,
      });

      await newMessage.save();
      // make sure user is in the group
      res.json(newMessage);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.update_message = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    try {
      const message = await message_model.findById(req.params.id).exec();

      if (!message)
        return res.status(404).json({ errors: ['Message not found'] });
      if (message.sender != req.user.id)
        return res
          .status(404)
          .json({ errors: ['User is not sender of the message'] });

      message.content = req.body.content;
      await message.save();
      res.json(message);
    } catch (e) {
      return next(e);
    }
  }),
];

exports.delete_message = [
  AsyncHandler(async (req, res, next) => {
    try {
      const message = await message_model.findById(req.params.id).exec();

      if (!message)
        return res.status(404).json({ errors: ['Message not found'] });
      if (message.sender != req.user.id)
        return res
          .status(404)
          .json({ errors: ['User is not sender of the message'] });

      const deletedMessage = await message_model.findByIdAndDelete(
        req.params.id
      );
      res.json(deletedMessage);
    } catch (e) {
      return next(e);
    }
  }),
];
