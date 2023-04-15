const { Router } = require('express');
const { Post, User } = require('../models');
const asyncHandler = require('../utils/async-handler');
const router = Router();

// 게시글 작성 - 작성 페이지 구현
router.get('/', asyncHandler(async (req, res) => {
  if (req.query.write) {
    res.render('post/edit');
    return;
  }
  // 게시글 목록 및 상세 - 게시글 목록, 게시글 목록에 작성자 표시 구현 - getPaginatedPosts 활용
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 10);
  // getPaginatedPosts 사용하기
  const [posts, totalPage] = await Post.getPaginatedPosts({}, page, perPage);
  res.render('post/list', { posts, page, perPage, totalPage, path: req.baseUrl });
}));

// 게시글 목록 및 상세 - 게시글 상세 구현, 작성자 추가
router.get('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  // shortId 로 게시글 찾기, populate 로 작성자 표시
  const post = await Post.findOne({ shortId }).populate('author');
  // 게시글 수정 - 수정페이지 구현
  if (req.query.edit) {
    res.render('post/edit', { post });
    return;
  }
  res.render('post/view', { post });
}));

// 게시글 작성 - POST 요청 처리 구현
router.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new Error('제목과 내용을 입력해 주세요');
  }
  // 로그인 된 사용자의 shortId 로 사용자를 찾아 게시글 생성시 작성자로 추가
  const author = await User.findOne({
    shortId: req.user.shortId,
  });
  if(!author){
    throw new Error('No Author')
  }
  // 게시글 생성
  const post = await Post.create({ title, content, author });
  res.redirect(`/posts/${post.shortId}`);
}));

// 게시글 수정 - 수정 요청 처리 구현
router.post('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    throw new Error('제목과 내용을 입력해 주세요');
  }
  // shortId 로 게시글 수정, populate 로 작성자 표시
  const post = await Post.findOne({ shortId }).populate('author'); 
  // 작성자와 로그인된 사용자의 shortId 가 다를경우 오류 발생
  if(post.author.shortId !== req.user.shortId){
    throw new Error('작성자가 아닙니다.')
  }
  // shortId 로 게시글 수정
  await Post.updateOne({ shortId }, { title, content });
  res.redirect(`/posts/${shortId}`);
}));

// 게시글 삭제 - DELETE 요청 처리 구현, populate 로 작성자 표시
router.delete('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  // shortId 로 게시글 삭제, populate 로 작성자 표시
  const post = await Post.findOne({ shortId }).populate('author');
  // 작성자와 로그인된 사용자의 shortId 가 다를경우 오류 발생
  if(post.author.shortId !== req.user.shortId){
    throw new Error('작성자가 아닙니다.')
  }
  // shortId 로 게시글 삭제
  await Post.deleteOne({ shortId });
  res.send('OK');
}));

module.exports = router;