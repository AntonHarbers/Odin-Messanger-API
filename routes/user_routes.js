var express = require('express');
var router = express.Router();
const userController = require('../controllers/user_controller');

/* GET users listing. */
router.get('/', userController.get_users);
router.get('/:id', userController.get_user);

router.post('/', userController.post_user);
router.put('/:id', userController.update_user);
router.delete('/:id', userController.delete_user);

module.exports = router;
