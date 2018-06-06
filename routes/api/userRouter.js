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
    res.redirect('/')
}
);

router.put('/role', updateRole)

router.get('/verify/:email/:verifyToken', verifyAccount)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword', resetPassword)
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

    
    let verifyToken = crypto.randomBytes(20).toString('hex');
    let userInfo = {
        email: req.body.email,
        password: md5(req.body.password),
        phone: req.body.phone,
        fullName: req.body.fullName,
        avatarURL: req.body.avatarURL,
        birthday: req.body.birthday,
        createdDate: req.body.createdDate,
        verifyToken: md5(verifyToken)
    }
    
    for (key in userInfo) {
        if (!userInfo[key]) {
            delete userInfo[key]
        }
    }

    usersModel.create(userInfo)
        .then(result => {
            mailer.sendMail(mailer.createVerifyMail(result.email,verifyToken))
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
        if(result.status === 'unverified' && result.verifyToken === md5(req.params.verifyToken)){
            result.status='verified';
            result.verifyToken= undefined;
            result.save();
            return res.send('Your account has been verified, you can login now')
        }
        return res.status(404).send('Some thing went wrong')
    })
    .catch(err=>res.status(404).send(`Account ${email} not exist`))
}

function forgetPassword(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is invalid').isEmail();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('err_msg', _.first(errors).msg)
        return res.redirect('/user/forgetPassword')
    }

    
    let resetToken = crypto.randomBytes(20).toString('hex');
    usersModel.findOneAndUpdate({email:req.body.email}, {resetToken: md5(resetToken)})
    .then(result=>{
        mailer.sendMail(mailer.createResetPassMail(result.email,resetToken))
        req.flash('success_msg', 'Please check your email to reset your password')
        return res.redirect('/user/signin')
    })
    .catch(err => {
        req.flash('err_msg', 'Email not found!')
        return res.redirect('/user/forgetPassword')
    })
}

function resetPassword(req, res, next) {
    usersModel.findOne({email: req.body.email}).exec()
    .then((result)=>{
        if(req.body.password !== req.body.password2) 
            return res.status(404).send('Password not match')
        if(result.resetToken === md5(req.body.resetToken)){
            result.resetToken= undefined;
            result.password= md5(req.body.password);
            result.save();
            return res.send('Your password has been changed, you can login now')
        }
        return res.status(404).send('Some thing went wrong')
    })
    .catch(err=>res.status(404).send(`Account ${email} not exist`))
}