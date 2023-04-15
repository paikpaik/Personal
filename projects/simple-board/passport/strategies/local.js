const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
const hashPassword = require('../../utils/hash-password');

// 로그인 기능 구현 - passport-local strategy
const config = {
  // 'email', 'password' 필드 사용하도록 필수적으로 설정
  usernameField: 'email',
  passwordField: 'password',
};

const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    // 검색 한 유저의 비밀번호와 요청된 비밀번호의 해쉬값이 일치하는지 확인
    if (user.password !== hashPassword(password)) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    // 세션에 저장되는 유저 정보의 최소화
    done (null, {
      shortId: user.shortId,
      email: user.email,
      name: user.name,
      // passwordReset 전달하기
      passwordReset: user.passwordReset,
    });
  } catch (err) {
    done(err, null);
  }
});

module.exports = local;