// Hash로 비밀번호 저장
const crypto = require('crypto');

module.exports = (password) => {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  return hash.digest("hex");
}