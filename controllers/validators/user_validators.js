const { body } = require('express-validator');

exports.post_user_validation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email should not be empty')
    .isEmail()
    .withMessage('Please enter a valid email adress')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
    .escape(),
  body('username', 'username should not be empty').trim().notEmpty().escape(),
  body('profile_pic_url').trim(),
];

exports.update_user_validation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please use valid email address')
    .optional()
    .escape(),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage('password should be at least 6 characters long')
    .escape(),
  body('username').optional().trim().escape(),
  body('profile_pic_url').optional().trim(),
];
