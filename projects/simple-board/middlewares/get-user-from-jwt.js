const passport = require('passport');

// jwt 미들웨어 추가, jwt 토큰 확인
module.exports = (req, res, next) => {
  if (!req.cookies.token) {
    next();
    return;
  }
  return passport.authenticate('jwt', { session: false })(req, res, next);
}