var express = require('express');
var router = express.Router();
const messageController = require('../controllers/message_controller');

/* GET users listing. */
router.get('/', messageController.get_messages);

module.exports = router;
