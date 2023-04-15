const { Router } = require('express');
const { Post, User } = require('../models');
const asyncHandler = require('../utils/async-handler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 10);

  const [posts, totalPage] = await Post.getPaginatedPosts({}, page, perPage);

  res.json({ posts, page, perPage, totalPage });
}));

router.get('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const post = await Post.findOne({ shortId }).populate('author');

  res.json(post);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    throw new Error('제목과 내용을 입력 해 주세요');
  }
  
  const author = await User.findOne({ shortId: req.user.shortId });

  const post = await Post.create({ title, content, author });
  res.json(post);
}));

router.post('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { title, content } = req.body;
  
  if (!title || !content) {
    throw new Error('제목과 내용을 입력 해 주세요');
  }
  
  const post = await Post.findOne({ shortId }).populate('author');
  if (post.author.shortId !== req.user.shortId) {
    throw new Error('권한이 없습니다.');
  }
    
  const updatedPost = await Post.findOneAndUpdate({ shortId }, { title, content });
  res.json(updatedPost);
}));

router.delete('/:shortId', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  
  const post = await Post.findOne({ shortId }).populate('author');
  if (post.author.shortId !== req.user.shortId) {
    throw new Error('권한이 없습니다.');
  }
  
  await Post.deleteOne({ shortId });
  res.json({ result: 'success' });
}));

router.get('/:shortId/comments', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const post = await Post.findOne({ shortId });
  
  await User.populate(post.comments, { path: 'author' });
  
  res.json(post.comments);
}));

router.post('/:shortId/comments', asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { content } = req.body;
  const author = await User.findOne({ shortId: req.user.shortId });
  
  await Post.updateOne({ shortId }, {
    $push: { comments: { content, author } },
  });
  
  res.json({ result: 'success' });
}));

module.exports = router;