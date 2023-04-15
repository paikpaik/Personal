const { Router } = require('express');
const passport = require('passport');
const { getUserToken } = require('../utils/jwt');

const router = Router();

router.post('/', passport.authenticate('local', { session: false }), (req, res, next) => {
  const token = getUserToken(req.user);
  res.json({ token });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res, next) => {
  const token = getUserToken(req.user);
  res.json({ token });
});

module.exports = router;