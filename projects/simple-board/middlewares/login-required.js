// 로그인 확인 미들웨어 - 로그인을 필수로 설정하고 싶을 때 사용
module.exports = (req, res, next) => {
  // 로그인이 안되어있다면 메인화면으로, 로그인이 되어있다면 다음 미들웨어로
  if(!req.user){
      res.redirect('/');
      return;
  }
  // passwordReset 확인하여 redirect 하기-비밀번호가 초기화 된 경우 /change-password로 경로 변경
  if(req.user.passwordReset){
    res.redirect('/change-password');
    return;
  }  
  next();
}