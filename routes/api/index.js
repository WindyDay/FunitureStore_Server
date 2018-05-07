var express = require('express');
var router = express.Router();
const productsRouter = require('./products')

/* GET users listing. */
router.use('/products', productsRouter);

module.exports = router;
