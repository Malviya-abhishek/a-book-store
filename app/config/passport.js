const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcrypt');

function init(passport) {
  // login logic
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {

      // check email exist
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: 'No user with this email' });
      }

      bcrypt.compare(password, user.password)
        .then(match => {
          if (match) {
            return done(null, user, { message: 'Logged in successfully' });
          }
          return done(null, false, { message: 'Wrong username or password' });
        })
        .catch(err => {
          return done(null, false, { message: 'Something went wrong' });
        });

    }));

  // store some identity in the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Remove id of the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;