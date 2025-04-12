module.exports.storage = require('./file_storage');
module.exports.BaseModel = require('./base.model');
module.exports.User = require('./user.model');
module.exports.Session = require('./session.model');
module.exports.Review = require('./review.model');

module.exports.ALL_MODELS = {
  User: module.exports.User,
  Session: module.exports.Session,
  Review: module.exports.Review,
};
