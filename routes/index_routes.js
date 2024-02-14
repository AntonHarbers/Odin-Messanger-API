var express = require('express');
var router = express.Router();
const indexController = require('../controllers/index_controller');
const authenticateJWT = require('../middleware/authenticateJWT');
const validators = require('../controllers/validators/index_validators');

/* GET home page. */
router.get('/', indexController.get_index);
router.post('/log-in', validators.login_validator, indexController.post_log_in);
router.get('/session', authenticateJWT, indexController.get_session);

module.exports = router;
