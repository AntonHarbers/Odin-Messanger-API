var express = require('express');
var router = express.Router();
const groupController = require('../controllers/group_controller');

/* GET users listing. */
router.get('/', groupController.get_groups);

module.exports = router;
