
var LocalStrategy = require('passport-local').Strategy
const md5 = require('md5')
var usersModel = require('./db/users')

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      function (email, password, done) {
        // console.log(email + " are logging");
        usersModel.findOne({
          email: email
        }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Incorrect email.'
            });
          }
          if (user.status !== 'verified') {
            // console.log('Incorrect password');
            return done(null, false, {
              message: 'Your account is not verified.'
            });
          }
          if (!usersModel.matchPassword(user.password, md5(password))) {
            // console.log('Incorrect password');
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }
          return done(null, user);
        });
      }
    ));
    
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
      usersModel.findById(id, function (err, user) {
        done(err, user);
      });
    });
}