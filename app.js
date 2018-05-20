var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var session = require("express-session")
var indexRouter = require('./routes/index');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require('connect-flash')
var validator = require('express-validator')
const md5 = require('md5')

var usersModel = require('./models/db/users')

var db = require('./models/db/db_connect');
var route = require('./routes')
var app = express();
// var hbs = require('hbs')
// hbs.registerHelper ("log", function (value) {
//    return console.log(value);
// });



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(validator());

//passport initialize
app.use(session({
  secret: "ryanno",
  saveUninitialized: false,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.err_msg = req.flash('err_msg');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error = req.flash('error');
  next()
})



//router
route(app);
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
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;