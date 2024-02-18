const { validationResult } = require('express-validator');

const validationResultHandling = (req, res, next) => {
  const errors = validationResult(req);
  console.log(!errors.isEmpty());
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array().map((err) => err.msg) });
  }

  next();
};

module.exports = validationResultHandling;
