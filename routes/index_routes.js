var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index_controller');

/* GET home page. */
router.get('/', indexController.get_index);

module.exports = router;
