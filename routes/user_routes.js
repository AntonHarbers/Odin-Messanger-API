var express = require('express');
var router = express.Router();
const userController = require('../controllers/user_controller');
const authenticateJWT = require('../middleware/authenticateJWT');

/* GET users listing. */
router.get('/', authenticateJWT, userController.get_users);
router.get('/:id', authenticateJWT, userController.get_user);

router.post('/', userController.post_user); // sign up
router.put('/:id', authenticateJWT, userController.update_user);
router.delete('/:id', authenticateJWT, userController.delete_user);

module.exports = router;
