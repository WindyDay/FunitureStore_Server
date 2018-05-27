var express = require('express');
var router = express.Router();
var usersModel = require('../../models/db/users')
var productsModel = require('../../models/db/products')
var categoriesModel = require('../../models/db/categories')


router.get('/SignIn', renderSignIn);
router.get('/SignUp', renderSignUp);
router.get('/SignOut', signOut);
router.get('/manager', manager);


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
  let users;
  let products;
  let categories;
  getAllUsers = new Promise((resolve, reject) => {
    usersModel.find((err, res) => {
      if (err) reject(err);
      users = res;
      resolve(res);
    })
  });

  getAllProducts = new Promise((resolve, reject) => {
    productsModel.load({select: 'name price oldPrice thumbnail colors categories description'},(err, res) => {
      if (err) reject(err);
      products = res;
      resolve(res);
    })
  });

  getAllCategories = new Promise((resolve, reject) => {
    categoriesModel.getAll((err, res) => {
      if (err) reject(err);
      categories = res;
      resolve(res);
    })
  });



  await Promise.all([getAllUsers, getAllProducts, getAllCategories])
    .then(results => {
      console.log(products[0])
      res.render('manager', {
        layout: 'managerLayout',
        users: users,
        products: products,
        categories: categories
      })
    })
    .catch(err => next(err))

}