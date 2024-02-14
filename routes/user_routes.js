var express = require('express');
var router = express.Router();
const userController = require('../controllers/user_controller');
const authenticateJWT = require('../middleware/authenticateJWT');
const validator = require('../controllers/validators/user_validators');
/* GET users listing. */
router.get('/', authenticateJWT, userController.get_users);
router.get('/:id', authenticateJWT, userController.get_user);

router.post('/', validator.post_user_validation, userController.post_user); // sign up
router.put(
  '/:id',
  validator.update_user_validation,
  authenticateJWT,
  userController.update_user
);
router.delete('/:id', authenticateJWT, userController.delete_user);

module.exports = router;
