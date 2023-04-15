const { User } = require('../models');

module.exports = (req, res, next) => {
  if (!req.user) {
    throw new Error('NotAuthorized')
    return;
  }
  
  if (req.user.passwordReset) {
    throw new Error('ChangePasswordNeeded')
    return;
  }

  next();
}