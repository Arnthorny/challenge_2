const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiError } = require('../utils/resp_handling');

async function getUserFromAuthorization(req) {
  try {
    const { authInfo } = req.headers;

    if (!authInfo) {
      return null;
    }
    const decodedObject = jwt.verify(authInfo[1], process.env.JWT_SECRET);
    const { id } = decodedObject;

    const user = User.get_by_id(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
}

async function tokenAuthentication(req, res, next) {
  const user = await getUserFromAuthorization(req);

  if (!user) throw new ApiError(401, 'Unauthorized');

  req.user = user;
  next();
}

module.exports = { tokenAuthentication };
