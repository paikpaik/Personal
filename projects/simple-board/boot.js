// const mongoose = require('mongoose');
// const { Post, User } = require('./models');
// const hashPassword = require('./utils/hash-password');

// mongoose.connect("mongodb+srv://jaeyoul:rhfueo12!%40!%40@simple-board-cluster.k8bpcjo.mongodb.net/test");

// async function boot() {
//   const elice = await User.create({
//     email: 'elice@test.com',
//     name: 'elice',
//     password: hashPassword("helloelice"),
//   });
//   const test = await User.create({
//     email: 'bob@test.com',
//     name: 'bob',
//     password: hashPassword("hellotest"),
//   });
  
//   for (let i = 0; i < 20; i ++) {
//     await Post.create({
//       title: `엘리스의 게시글 입니다. ${i}`,
//       content: '치킨은 맛있습니다.',
//       author: elice,
//     });
    
//     await Post.create({
//       title: `밥의 게시글 입니다. ${i}`,
//       content: '피자는 맛있습니다.',
//       author: test,
//     });
//   }
// }

// boot()
//   .then(() => process.exit());