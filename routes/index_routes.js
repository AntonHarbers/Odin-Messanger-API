var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index_controller');

/* GET home page. */
router.get('/', indexController.get_index);
router.get('/log-in', indexController.log_in);
router.get('/session', indexController.get_session);

module.exports = router;
