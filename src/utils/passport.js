const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  let user = await User.findOne({ email: email });
  if (user) {
    const ch = await user.checkPassword(password);
    console.log(ch);
    if (ch) {
      return done(null, user)
    }
    else {
      return done(null, false, "incorrect password");
    }

  }
  else {
    return done(null, false, "user not found");
  }
}));