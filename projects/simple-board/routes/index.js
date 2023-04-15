const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');
const sendMail = require('../utils/send-mail');
const generateRandomPassword = require('../utils/generate-random-password')
const { User } = require('../models');
const router = Router();

router.get('/', (req, res) => {
  // 로그인 된 경우 /posts로, 로그인 되지 않은 경우 /login 으로
  if(req.user){
    res.redirect('/posts');
    return;
  }
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  res.render('user/login');
});

router.get('/join', (req, res, next) => {
  res.render('user/join');
});

// 회원가입 구현
router.post('/join', asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  // 비밀번호 해쉬값 만들기
  const hashedPassword = hashPassword(password);
  // 회원 생성하기
  const user = await User.create({
    email,
    name,
    password: hashedPassword,
  });
  res.redirect('/');
}));

// 로그아웃 구현 - jwt 로그아웃을 위해 비활성화
// router.get('/logout', (req, res, next) => {
//   req.logout(() => {
//     res.redirect('/');
//   });
// });

// jwt 로그아웃 구현
router.get('/logout', (req, res, next) => {
  res.cookie('token', null, { maxAge: 0 });
  res.redirect('/');
});

// 비밀번호 초기화 구현
router.get('/reset-password', (req, res, next) => {
  res.render('user/reset-password');
});

// 비밀번호 초기화 구현
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('해당 메일로 가입된 사용자가 없습니다.');
  }
  // user가 있다면 랜덤 패스워드 생성하기
  const password = generateRandomPassword();
  await User.updateOne({ email }, {
    // hashPassword 로 업데이트 하기
    password: hashPassword(password),
    // passwordReset - 사용자 비밀번호를 업데이트 할 때 리셋값 전달
    passwordReset: true,
  });
  // 초기화 된 패스워드를 사용자에게 발송하기
  await sendMail(email, '비밀번호가 변경되었습니다.', `변경된 비밀번호는: ${password} 입니다.`);
  res.render('user/reset-password-confirmed');
}));

// 비밀번호 초기화 후 비밀번호 변경 구현
router.get('/change-password', (req, res, next) => {
  res.render('user/change-password');
});

// 비밀번호 초기화 후 비밀번호 변경 구현
router.post('/change-password', asyncHandler(async (req, res) => {
  const { currentPassword, password } = req.body;
  const user = await User.findOne({ shortId: req.user.shortId });
  if (user.password !== hashPassword(currentPassword)) {
    throw new Error('임시 비밀번호가 일치하지 않습니다.');
  }
  await User.updateOne({ shortId: user.shortId }, {
    password: hashPassword(password),
    passwordReset: false,
  });
  res.redirect('/logout');
}));

module.exports = router;