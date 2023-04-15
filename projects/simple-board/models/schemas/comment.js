const { Schema } = require('mongoose');

// 게시글에 댓글 추가 기능 구현
const CommentSchema = new Schema({
  // content, String, required, author, User, required
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = CommentSchema;