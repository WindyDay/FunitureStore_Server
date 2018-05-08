var express = require('express');
var router = express.Router();
const productsRouter = require('./products')
const categoriesRouter = require('./categories')

/* GET users listing. */
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);

module.exports = router;
