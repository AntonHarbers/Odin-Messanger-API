const AsyncHandler = require('express-async-handler');

exports.get_groups = [
  AsyncHandler(async (req, res, next) => {
    res.json({ data: 'groups' });
  }),
];
