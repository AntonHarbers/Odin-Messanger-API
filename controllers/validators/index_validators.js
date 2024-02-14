const { body } = require('express-validator');

exports.login_validator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email should not be empty')
    .isEmail()
    .withMessage('Please enter a valid email')
    .escape(),
  body('password', 'password should be at least 6 characters long')
    .trim()
    .isLength({ min: 6 })
    .escape(),
];
