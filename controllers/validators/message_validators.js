const { body } = require('express-validator');

exports.post_message_validation = [
  body('content', 'content should not be empty').trim().notEmpty(),
  body('group', 'group should not be empty').trim().isLength({ min: 1 }),
];

exports.update_message_validation = [
  body('content', 'content should not be empty').trim().notEmpty(),
];
