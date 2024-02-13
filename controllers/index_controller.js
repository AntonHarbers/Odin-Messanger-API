const AsyncHandler = require('express-async-handler');

exports.get_index = [
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'index' });
  }),
];

exports.log_in = [
  AsyncHandler(async (req, res, next) => {
    res.json('logged in');
  }),
];

exports.get_session = [
  AsyncHandler(async (req, res, next) => {
    res.json('get session');
  }),
];
