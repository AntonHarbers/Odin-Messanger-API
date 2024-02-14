var express = require('express');
var router = express.Router();
const groupController = require('../controllers/group_controller');
const authenticateJWT = require('../middleware/authenticateJWT');
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

router.patch('/:id', authenticateJWT, groupController.update_group);
router.patch('/:id/add', authenticateJWT, groupController.add_group_member);
router.patch(
  '/:id/remove',
  authenticateJWT,
  groupController.remove_group_member
);

router.delete('/:id', authenticateJWT, groupController.delete_group);

module.exports = router;
