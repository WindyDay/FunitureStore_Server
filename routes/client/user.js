var express = require('express');
var router = express.Router();
var usersModel = require('../../models/db/users')
var productsModel = require('../../models/db/products')
var categoriesModel = require('../../models/db/categories')
var colorsModel = require('../../models/db/colors')
const auth = require('../authorization');
const os = require('os')


router.get('/SignIn', renderSignIn);
router.get('/SignUp', renderSignUp);
router.get('/SignOut', signOut);
router.get('/manager', auth.ModAuthorized, manager);


module.exports = router;



function renderSignIn(req, res, next) {
  res.render('signin');
}

function renderSignUp(req, res, next) {
  res.render('signup');
}


function signOut(req, res, next) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/SignIn');
}

async function manager(req, res, next) {
  console.log(req.user)
  getAllUsers = new Promise((resolve, reject) => {
    usersModel.find((err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });

  getAllProducts = new Promise((resolve, reject) => {
    productsModel.load({select: 'name price oldPrice thumbnail colors categories description'},(err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });

  getAllCategories = new Promise((resolve, reject) => {
    categoriesModel.getAll((err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });
  getAllColors = new Promise((resolve, reject) => {
    colorsModel.getAll((err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  });



  await Promise.all([getAllUsers, getAllProducts, getAllCategories, getAllColors])
    .then(results => {
      res.render('manager', {
        layout: 'managerLayout',
        users: results[0],
        products: results[1],
        categories: results[2],
        colors: results[3]
      })
    })
    .catch(err => next(err))

}