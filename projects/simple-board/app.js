const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const session = require('express-session');
const passport = require('passport'); 
const mongoStore = require('connect-mongo');
const loginRequired = require('./middlewares/login-required');
const getUserFromJWT = require('./middlewares/get-user-from-jwt')
const indexRouter = require('./routes');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

require("./passport")();

mongoose.connect(
  "mongodb+srv://jaeyoul:rhfueo12!%40!%40@simple-board-cluster.k8bpcjo.mongodb.net/test"
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB Connected");
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// 게시글 목록 및 상세 - formatDate 함수 추가
app.locals.formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 로그인 기능 구현, jwt 로그인과 passport-jwt를 적용하기 위해 세션 비활성화
// app.use(
//   session({
//     secret: "elice",
//     resave: false,
//     saveUninitialized: true,
//     // 세션 스토어 사용하기 - 서버 재가동시 로그인 안풀림
//     store: mongoStore.create({
//       mongoUrl: "mongodb+srv://jaeyoul:rhfueo12!%40!%40@simple-board-cluster.k8bpcjo.mongodb.net/test",
//     }),
//   })
// );

// passport initialize, session
app.use(passport.initialize());
// 로그인 기능 구현, jwt 로그인과 passport-jwt를 적용하기 위해 세션 비활성화
// app.use(passport.session());

// jwt 로그인 미들웨어 추가 - passport.initialize()와 Router 사이에 들어가야 정확하게 동작
app.use(getUserFromJWT); 

app.use("/", indexRouter);
// /posts 경로에 로그인 필수로 설정하기 - 로그인 확인 미들웨어 loginRequired 이후 postsRouter 실행
app.use("/posts", loginRequired, postsRouter);
app.use("/users", loginRequired, usersRouter)
app.use("/api", loginRequired, apiRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
