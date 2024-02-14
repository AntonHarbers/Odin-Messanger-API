const AsyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User_Model = require('../models/user_model');
const bcrypt = require('bcryptjs');
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
  AsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty())
      return res.json({ errors: errors.array().map((err) => err.msg) });

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
  AsyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array().map((err) => err.msg) });
      }

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
    try {
      const deleted_user = await User_Model.findByIdAndDelete(req.params.id);
      res.json({ deleted_user });
    } catch (e) {
      return next(e);
    }
  }),
];
