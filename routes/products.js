var express = require('express');
var router = express.Router();
let axios = require('axios');
const CONST = require('../constants');


_axios = axios.create({
  baseURL: CONST.ONL_API_PATH
});

/* GET products page */
router.get('/', function (req, res, next) {

  function getProductsList() {
    return _axios.get('/products', {
      params: req.query
    })
  }

  function getCategories() {
    return _axios.get('/categories');

  }
  axios.all([getProductsList(), getCategories()])
    .then(axios.spread(function (products, categories) {
      console.log(categories.data);
      res.render('products', {
        products: products.data,
        categories: categories.data,
      });
      // Both requests are now complete
    }))
    .catch(err => next(err));
  // axios.get('/products', {
  //     params: req.query
  //   })
  //   .then(function (response) {
  //     res.render('products', {products: response.data});
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
});

router.get('/:productId', function (req, res, next) {
  let data = null;

  axios.get('/products/' + req.params.productId)
    .then(function (response) {
      res.render('product', {
        product: response.data
      });
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;