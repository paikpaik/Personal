const mongoose = require('mongoose');
const PostSchema = require('./schemas/post');
const UserSchema = require('./schemas/user');

// 게시글 목록 및 상세 - 게시글 목록, Pagination 구현, 게시글 목록에 작성자 표시 구현 - pagination 활용
const Post = mongoose.model('Post', PostSchema);
Post.getPaginatedPosts = async (query, page, perPage) => {  
  const [total, posts] = await Promise.all([
    // 전체 게시글 수 쿼리하기
    Post.countDocuments(query),
    Post
      .find(query)
      .sort({ createdAt : -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      // populate 추가하기
      .populate('author'),
  ]);
  const totalPage = Math.ceil(total / perPage);
  return [posts, totalPage];
}

exports.Post = Post;
exports.User = mongoose.model('User', UserSchema);