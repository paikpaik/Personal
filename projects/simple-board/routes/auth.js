const { Router } = require('express');
const passport = require('passport');
const { setUserToken } = require('../utils/jwt');
const router = Router();

// 로그인 기능 구현, passport local 로 authenticate 하기, jwt 로그인과 passport-jwt를 적용하기 위해 세션 비활성화
router.post('/', passport.authenticate('local', { session: false }), (req, res, next) => {
  // 유저 토큰 생성 및 쿠키에 전달하기
  setUserToken(res, req.user);
  res.redirect('/');
});

//구글 로그인 기능 구현
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res, next) => {
  // userToken 설정하기
  setUserToken(res, req.user);
  res.redirect('/');
});

module.exports = router;