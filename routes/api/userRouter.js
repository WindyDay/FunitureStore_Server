var express = require('express');
var router = express.Router();
const usersModel = require('../../models/db/users')
const _ = require('lodash')
const md5 = require('md5');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto')
const mailer = require('../mailer')

router.post('/SignUp', signUp);

router.post('/SignIn', standardizeEmail, passport.authenticate('local', {
    // successRedirect: '/',
    failureRedirect: '/user/SignIn',
    failureFlash: true
}), (req, res, next)=>{
    // req.flash('success_msg', 'Logged in')
    res.redirect('/')
}
);

router.put('/role', updateRole)

router.get('/verify/:email/:verifyCode', verifyAccount)
module.exports = router;


function signUp(req, res, next) {

    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();
    req.checkBody('phone', 'Phone is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('err_msg', _.first(errors).msg)
        return res.redirect('/user/signup')
    }

    
    let verifyCode = crypto.randomBytes(20).toString('hex');
    let userInfo = {
        email: req.body.email,
        password: md5(req.body.password),
        phone: req.body.phone,
        fullName: req.body.fullName,
        avatarURL: req.body.avatarURL,
        birthday: req.body.birthday,
        createdDate: req.body.createdDate,
        verifyCode: md5(verifyCode)
    }
    console.log('verifyCode:' + verifyCode);
    
    for (key in userInfo) {
        if (!userInfo[key]) {
            delete userInfo[key]
        }
    }

    usersModel.create(userInfo)
        .then(result => {
            mailer.sendMail(mailer.createVerifyMail(result.email,verifyCode))
            req.flash('success_msg', 'Please check your email to verify account, then you can login')
            return res.redirect('/user/signin')
        })
        .catch(err => {
            req.flash('err_msg', 'Email existed')
            return res.redirect('/user/signup')
        })
}

// function signIn(req, res, next) {
//     res.render('signin');
// }

function standardizeEmail(req, res, next){
    req.body.email = req.body.email.trim().toLowerCase();
    next();
}

function updateRole(req, res, next){
    if(!req.body.email || !req.body.role) return next('Need userID and new role')
    usersModel.findOneAndUpdate({email:req.body.email}, {role: req.body.role})
    .then((result)=>{
        res.send(result);
    })
    .catch(err=>next(err));
    
}

function verifyAccount(req, res, next){
    usersModel.findOne({email: req.params.email}).exec()
    .then((result)=>{
        if(result.status === 'unverified' && result.verifyCode === md5(req.params.verifyCode)){
            result.status='verified';
            result.verifyCode= undefined;
            result.save();
            return res.send('Your account has been verified, you can login now')
        }
        return res.status(404).send('Some thing went wrong')
    })
    .catch(err=>res.status(404).send('Account not exist'))
}