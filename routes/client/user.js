var express = require('express');
var router = express.Router();

router.get('/SignIn', renderSignIn);
router.get('/SignUp', renderSignUp);


module.exports = router;



function renderSignIn(req,res,next){
  res.render('signin');
}

function renderSignUp(req,res,next){
  res.render('signup');
}