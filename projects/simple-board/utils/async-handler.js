// 매번 try ~ catch를 작성하기 싫어서 만든 비동기 async 익명 함수
module.exports = (requestHandler) => {
  return async (req, res, next) => {
    try{
      await requestHandler(req, res);
    }catch(err){
      next(err);
    }
  }
}