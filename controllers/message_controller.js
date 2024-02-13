const AsyncHandler = require('express-async-handler');

exports.get_messages = [
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'messages' });
  }),
];
