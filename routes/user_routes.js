var express = require('express');
var router = express.Router();
const userController = require('../controllers/user_controller');

/* GET users listing. */
router.get('/', userController.get_users);

module.exports = router;
