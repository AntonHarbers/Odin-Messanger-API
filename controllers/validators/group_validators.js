const { body } = require('express-validator');
const user_model = require('../../models/user_model');

exports.post_group_validator = [
  body('name', 'name should not be empty').trim().isLength({ min: 1 }).escape(),
  body('admin')
    .trim()
    .custom(async (adminId) => {
      const user = await user_model.findById(adminId).exec();
      if (!user) {
        return Promise.reject('Admin user does not exist');
      }
    })
    .escape(),
  body('members', 'members array should not be empty').notEmpty(),
  body('message').optional().trim().escape(),
  body('profile_pic_url').optional().trim(),
];
