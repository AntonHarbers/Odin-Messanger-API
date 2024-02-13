const AsyncHandler = require('express-async-handler');

exports.get_users = [
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'users' });
  }),
];
