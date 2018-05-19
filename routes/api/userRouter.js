var express = require('express');
var router = express.Router();
const usersModel = require('../../models/db/users')

router.post('/SignUp', signUp);

function signUp(req, res, next) {
    let userInfo = {
        email: req.body.email,
        password: req.body.password,
        phone:req.body.phone,
        fullName: req.body.fullName,
        avatarURL:req.body.avatarURL,
        birthday: req.body.birthday,
        createdDate:req.body.createdDate,
    }

    for(key in userInfo){
        if(!userInfo[key]) {
            console.log(key);
            delete userInfo[key]
        }
    }
    console.log(userInfo)

    usersModel.create(userInfo)
    .then(result=>res.send(result))
    .catch(err=>next(err))
}

module.exports = router;