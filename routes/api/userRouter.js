var express = require('express');
var router = express.Router();
const usersModel = require('../../models/db/users')
const _ = require('lodash')

router.post('/SignUp', signUp);
router.get('/SignIn', signIn);


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

    let userInfo = {
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        fullName: req.body.fullName,
        avatarURL: req.body.avatarURL,
        birthday: req.body.birthday,
        createdDate: req.body.createdDate,
    }

    for (key in userInfo) {
        if (!userInfo[key]) {
            delete userInfo[key]
        }
    }

    usersModel.create(userInfo)
        .then(result => {
            req.flash('success_msg', 'Now you can login')
            return res.redirect('/user/signin')
        })
        .catch(err => {
            req.flash('err_msg', 'Email existed')
            return res.redirect('/user/signup')
        })
}

function signIn(req, res, next){
    res.render('signin');
}