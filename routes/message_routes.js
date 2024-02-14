var express = require('express');
var router = express.Router();
const messageController = require('../controllers/message_controller');
const authenticateJWT = require('../middleware/authenticateJWT');
const validator = require('../controllers/validators/message_validators');

/* GET users listing. */
router.get('/', authenticateJWT, messageController.get_messages);
router.get('/:group', authenticateJWT, messageController.get_group_messages);

router.post(
  '/',
  authenticateJWT,
  validator.post_message_validation,
  messageController.post_message
);
router.patch(
  '/:id',
  authenticateJWT,
  validator.update_message_validation,
  messageController.update_message
);
router.delete('/:id', authenticateJWT, messageController.delete_message);

module.exports = router;
