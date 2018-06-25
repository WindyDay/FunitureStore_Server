var express = require('express');
var router = express.Router();
let axios = require('axios');
const CONST = require('../../constants');
const _ = require('lodash')


_axios = axios.create({
  baseURL: CONST.ONL_API_PATH
});

/* GET products page */
router.get('/', renderProducts);
router.get('/:productId', renderProductDetail);

module.exports = router;


function renderProducts(req, res, next) {

  function getProductsList() {
    return _axios.get('/products', {
      params: req.query
    })
  }

  function getCategories() {
    return _axios.get('/categories');

  }

  function getColors() {
    return _axios.get('/colors');
  }

  axios.all([getProductsList(), getCategories(), getColors()])
    .then(axios.spread(function (products, categories, colors) {
      // console.log(categories.data);
      res.render('products', {
        products: products.data,
        categories: categories.data,
        colors: colors.data,
      });
      // Both requests are now complete
    }))
    .catch(err => next(err));
}

function renderProductDetail(req, res, next) {
  let data = null;

  _axios.get('/products/' + req.params.productId)
    .then(function (productDetail) {
      // &categories=${productDetail.categories[0].name}
      let category = _.get(productDetail.data, 'categories[0].name', undefined);
      _axios.get(`/products?maxResults=10`+(category?'&categories='+category:''))
        .then((similarProducts)=>{
          
          res.render('product', {
            product: productDetail.data,
            similarProducts: similarProducts.data
          });
        })
      
    })
    .catch(function (error) {
      console.log(error);
      next(error);
    });
}