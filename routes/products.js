var express = require('express');
var router = express.Router();
let axios = require('axios');
const CONST = require('../constants');


axios = axios.create({baseURL: CONST.ONL_API_PATH});

/* GET products page */
router.get('/', function (req, res, next) {

  axios.get('/products', {
      params: req.query
    })
    .then(function (response) {
      res.render('products', {products: response.data});
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get('/:productId', function (req, res, next) {
  let data = null;

  axios.get('/products/'+req.params.productId)
    .then(function (response) {
      res.render('product', {product: response.data});
      // console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;