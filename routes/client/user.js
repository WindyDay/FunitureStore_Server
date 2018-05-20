var express = require('express');
var router = express.Router();
var User = require('../../models/db/users')


router.get('/SignIn', renderSignIn);
router.get('/SignUp', renderSignUp);
router.get('/SignOut', signOut);


module.exports = router;



function renderSignIn(req, res, next) {
  res.render('signin');
}

function renderSignUp(req, res, next) {
  res.render('signup');
}


function signOut(req, res, next){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/SignIn');
}