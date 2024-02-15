var express = require('express');
var router = express.Router();
const groupController = require('../controllers/group_controller');
const authenticateJWT = require('../middleware/authenticateJWT');
const groupAdminAuth = require('../middleware/groupAdminAuth');
const validators = require('../controllers/validators/group_validators');

/* GET users listing. */
router.get('/', authenticateJWT, groupController.get_groups);
router.get('/:id', authenticateJWT, groupController.get_group);

router.post(
  '/',
  authenticateJWT,
  validators.post_group_validator,
  groupController.post_group
);

router.patch(
  '/:id',
  authenticateJWT,
  groupAdminAuth,
  validators.update_group_validator,
  groupController.update_group
);

router.patch(
  '/:id/add',
  authenticateJWT,
  groupAdminAuth,
  validators.change_group_member_validator,
  groupController.add_group_member
);

router.patch(
  '/:id/remove',
  authenticateJWT,
  groupAdminAuth,
  validators.change_group_member_validator,
  groupController.remove_group_member
);

router.patch(
  '/:id/admin',
  authenticateJWT,
  groupAdminAuth,
  validators.replace_admin_validator,
  groupController.replace_admin
);

router.delete(
  '/:id',
  authenticateJWT,
  groupAdminAuth,
  groupController.delete_group
);

module.exports = router;
