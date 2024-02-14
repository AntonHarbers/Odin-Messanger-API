const AsyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User_Model = require('../models/user_model');

exports.get_index = [
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'Welcome to odin messenger api' });
  }),
];

exports.post_log_in = [
  AsyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.json({ errors: errors.array().map((err) => err.msg) });

    const user = await User_Model.find({ email: req.body.email }).exec();

    if (user.length == 0)
      return res.json({
        errors: [`User with email: ${req.body.email} not found`],
      });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) {
      return res.json({ errors: ['Incorrect Password'] });
    }

    const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json(token);
  }),
];

exports.get_session = [
  AsyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decodedToken = jwt.decode(token);
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
      const timeLeft = decodedToken.exp - currentTime;

      res.json({
        message: 'You are signed in',
        expiresIn: timeLeft > 0 ? `${timeLeft} seconds` : 'Token expired',
      });
    } catch (error) {
      res.status(400).json({ errors: ['Invalid Token'] });
    }
  }),
];
