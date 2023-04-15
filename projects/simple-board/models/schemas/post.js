const { Schema } = require('mongoose');
const shortId = require('./types/short-id');
const CommentSchema = require('./comment');

// post 모델 (회원가입 로그인 후 작성자 연동), index로 사용자 검색 기능 추가
const PostSchema = new Schema({
  // shortId 추가
  shortId,
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // index 추가하기
    index: true,
  },
  // 게시글에 댓글을 담기 구현, mongoose의 sub-schema 활용해서 comments 필드 선언 
  comments: [CommentSchema],
}, {
  timestamps: true,
});

module.exports = PostSchema;