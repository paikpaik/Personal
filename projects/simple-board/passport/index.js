const passport = require('passport');
const local = require('./strategies/local');
const jwt = require('./strategies/jwt');
const google = require('./strategies/google');

// jwt 로그인, passport-jwt 적용, google Oauth 로그인, passport-google 적용
module.exports = () => {
  // local strategy 사용, passport.use() 선언 필수
  passport.use(local)
  // jwt strategy 사용
  passport.use(jwt);
  // google Oauth strategy 사용
  passport.use(google)

  // 로그인 기능 구현, jwt 로그인과 passport-jwt를 적용하기 위해 세션 비활성화 
  // passport.serializeUser((user, callback) => {
  //   callback(null, user);
  // });
  // passport.deserializeUser((obj, callback) => {
  //   callback(null, obj);
  // });
};