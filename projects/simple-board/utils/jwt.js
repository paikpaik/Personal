const jwt = require('jsonwebtoken');
const secret = 'elice';

// jwt 로그인 기능 구현
exports.secret = secret;
exports.setUserToken = (res, user) => {
  // 유저 jwt 토큰생성
  const token = jwt.sign(user, secret);
  // 토큰을 쿠키로 전달
  res.cookie('token', token);
}