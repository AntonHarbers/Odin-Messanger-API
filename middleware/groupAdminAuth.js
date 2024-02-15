const AsyncHandler = require('express-async-handler');
const Group_Model = require('../models/group_model');

const groupAdminAuth = AsyncHandler(async (req, res, next) => {
  // check if user.id is admin of the req.params.group groupId
  try {
    const group = await Group_Model.findById(req.params.id).exec();

    if (!group) return res.status(404).json({ errors: ['Group not found'] });

    if (group.admin != req.user.id)
      return res
        .status(404)
        .json({ errors: ['User is not admin of this group'] });

    req.group = group;
    next();
  } catch (e) {
    return res.sendStatus(401);
  }
});

module.exports = groupAdminAuth;
