const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');
const sendMail = require('../utils/send-mail');
const generateRandomPassword = require('../utils/generate-random-password')
const { User } = require('../models');

const router = Router();

router.post('/join', asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = hashPassword(password);
  const user = await User.create({
    email,
    name,
    password: hashedPassword,
  });
    
  res.json({ result: 'success' });
}));

router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('해당 메일로 가입된 사용자가 없습니다.');
  }
  
  const newPassword = generateRandomPassword();
  
  await User.updateOne({ email }, {
    password: hashPassword(newPassword),
    passwordReset: true,
  });
  
  await sendMail(email, '임시 비밀번호가 발급되었습니다', `회원님의 임시 비밀번호는 [${newPassword}] 입니다.`);
  
  res.json({ result: 'success' });
}));

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
  
  res.json({ result: 'success' });
}));

module.exports = router;