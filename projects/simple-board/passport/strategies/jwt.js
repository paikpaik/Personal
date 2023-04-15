const JwtStrategy = require('passport-jwt').Strategy;
const { secret } = require('../../utils/jwt');

// passport-jwt 사용하기, req 의 cookies 에서 token 활용
const cookieExtractor = (req) => {
  const { token } = req.cookies;
  return token;
};

// passport-jwt 사용하기, ./utils/jwt 의 secret 활용
const opts = {
  secretOrKey: secret, 
  jwtFromRequest: cookieExtractor,
}

module.exports = new JwtStrategy(opts, (user, done) => {
  done(null, user);
});