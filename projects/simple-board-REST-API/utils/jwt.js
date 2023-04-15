const jwt = require('jsonwebtoken');

const secret = 'elice';

exports.secret = secret;

exports.getUserToken = (user) => {
  return jwt.sign(user, secret);
}