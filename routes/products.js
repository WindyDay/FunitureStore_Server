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
      console.log(req.query);
    })
    .catch(function (error) {
      console.log(error);
    });
  // console.log(req);
  res.render('products');
  // console.log(req.headers.host);
  // next();
});

module.exports = router;