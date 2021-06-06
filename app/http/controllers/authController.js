const User = require('../../model/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function AuthController() {
  return {
    login(req, res) {
      return res.render('auth/login')
    },
    register(req, res) {
      return res.render('auth/register')
    },

    postLogin(req, res, next) {
      const {email, password } = req.body;

      if (!email || !password) {
        req.flash('error', 'All fields are required');
        req.flash('email', email);
        return res.redirect('/login');
      }

      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }
        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/login');
        }
        req.login(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }
        });
        return res.redirect('/');
      })(req, res, next);
    },

    async postRegister(req, res, next) {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        req.flash('error', 'All fields are requied');
        req.flash('name', name);
        req.flash('email', email);
        return res.redirect('/register');
      }

      //Hashig password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name: name,
        email: email,
        password: hashedPassword
      });

      user.save().then(() => {
        // Login Logic
        passport.authenticate('local', (err, user, info) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }
          if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
          }
          req.login(user, (err) => {
            if (err) {
              req.flash('error', info.message);
              return next(err);
            }
          });
          return res.redirect('/');
        })(req, res, next);

        // return res.redirect('/');
      }).catch(err => {
        // Same email
        if (err.code === 11000) {
          req.flash('error', 'Email Already registered');
          req.flash('name', name);
          req.flash('email', email);
          return res.redirect('/register');
        }

        req.flash('error', 'Something went wrong');
        return res.redirect('/register');
      });
    },

    postLogout(req, res, next){
      req.logout();
      return res.redirect('/');
    }

  }
}


module.exports = AuthController;