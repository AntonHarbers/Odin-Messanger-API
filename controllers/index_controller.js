const AsyncHandler = require('express-async-handler');

exports.get_index = [
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'index' });
  }),
];
