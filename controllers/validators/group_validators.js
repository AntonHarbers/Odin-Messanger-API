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

exports.update_group_validator = [
  body('name').optional().trim().escape(),
  body('message').optional().trim().escape(),
  body('profile_pic_url').optional().trim(),
];

exports.replace_admin_validator = [
  body('admin').trim().notEmpty().withMessage('admin should not be empty'),
];

exports.change_group_member_validator = [
  body('member').trim().notEmpty().withMessage('member should not be empty'),
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
