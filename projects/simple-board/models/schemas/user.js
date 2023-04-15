const { Schema } = require('mongoose');
const shortId = require('./types/short-id');

const UserSchema = new Schema({
  shortId,
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // passwordReset 추가 - 비밀번호 초기화 후 로그인 시 비밀번호 변경
  passwordReset: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = UserSchema;