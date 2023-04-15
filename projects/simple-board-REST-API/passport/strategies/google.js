const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, OAuth } = require('../../models');

const config = {
  clientID: '211607181355-83amtvn2b59s8g3umc8q2g89cghmb113.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback"
};

async function findOrCreateUser({ name, email }) {
  const user = await User.findOne({
    email,
  });

  if (user) { 
    return user;
  }

  const created = await User.create({
    name,
    email,
    password: 'GOOGLE_OAUTH',
  });

  return created;
}

module.exports = new GoogleStrategy(config, async (accessToken, refreshToken, profile, done) => {
  const { email, name } = profile._json;

  try {
    const user = await findOrCreateUser({ email, name })
    done(null, {
      shortId: user.shortId,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    done(e, null);
  }
});