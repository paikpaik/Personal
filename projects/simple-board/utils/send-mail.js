const nodemailer = require('nodemailer');

// 메일 발송 기능 구현 - nodemailer 로 gmail transport 생성
const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'woduf9311@gmail.com',
    pass: 'sttuozfdtyegrczf',
  },
});

module.exports = (to, subject, text) => new Promise((resolve, reject) => {
  const message = {
    to,
    subject,
    text,
  };
  
  transport.sendMail(message, (err, info) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(info);
  });
});