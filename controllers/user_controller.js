const AsyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User_Model = require('../models/user_model');
const Group_Model = require('../models/group_model');
const Message_Model = require('../models/message_model');
const bcrypt = require('bcryptjs');
const validationResultHandling = require('../middleware/validationResultHandling');
const { default: mongoose } = require('mongoose');

require('dotenv').config();

exports.get_users = [
  AsyncHandler(async (req, res, next) => {
    try {
      const users = await User_Model.find(
        {},
        'username email created_at'
      ).exec();
      res.json(users);
    } catch (e) {
      return next(e);
    }
  }),
];

// sign up route
exports.post_user = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    // make sure user does not already exist with same email
    const existingUser = await User_Model.find({
      email: req.body.email,
    }).exec();

    if (existingUser[0])
      return res.json({
        errors: [`User with email: ${req.body.email} already exists`],
      });

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const newUser = new User_Model({
          email: req.body.email,
          password: hashedPassword,
          username: req.body.username,
          profile_pic_url: req.body.profile_pic_url,
        });

        await newUser.save();
        res.json(newUser);
        return;
      }
    });
  }),
];

exports.update_user = [
  validationResultHandling,
  AsyncHandler(async (req, res, next) => {
    try {
      const userData = {};

      if (req.body.email) userData.email = req.body.email;
      if (req.body.username) userData.username = req.body.username;
      if (req.body.profile_pic_url)
        userData.profile_pic_url = req.body.profile_pic_url;
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        console.log(hash);
        userData.password = hash;
      }
      const updatedUser = await User_Model.findByIdAndUpdate(
        req.params.id,
        userData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ errors: ['User not found'] });
      }

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }),
];

exports.get_user = [
  AsyncHandler(async (req, res, next) => {
    try {
      const user = await User_Model.findById(req.params.id).exec();
      res.json(user);
    } catch {
      return next({ errors: 'user not found' });
    }
  }),
];

exports.delete_user = [
  AsyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // get all the groups where user is in the members array, delete user id from members list
      await Group_Model.updateMany(
        { members: req.params.id },
        { $pull: { members: req.params.id } },
        { session }
      ).exec();
      // get all the groups where user_id is the admin
      const adminGroups = await Group_Model.find({ admin: req.params.id })
        .select('_id')
        .lean()
        .session(session)
        .exec();
      const groupIds = adminGroups.map((group) => group._id);
      //delete all messages associated with those groups
      await Message_Model.deleteMany(
        { group: { $in: groupIds } },
        { session }
      ).exec();
      //and then delete the groups
      await Group_Model.deleteMany(
        { _id: { $in: groupIds } },
        { session }
      ).exec();

      // find all messages where the sender_id is the user_id and set that user id to the deleted user profile
      await Message_Model.updateMany(
        { sender: req.params.id },
        { $set: { sender: process.env.DELETED_USER_ID } },
        { session }
      ).exec();
      const deleted_user = await User_Model.findByIdAndDelete(req.params.id, {
        session,
      }).exec();

      await session.commitTransaction();
      res.json({
        message: 'User and related data successfully deleted',
        deleted_user: deleted_user ? deleted_user : null,
      });
    } catch (e) {
      await session.abortTransaction();

      return next(e);
    } finally {
      session.endSession();
    }
  }),
];
