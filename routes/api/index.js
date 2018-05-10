var express = require('express');
var router = express.Router();
const productsRouter = require('./products')
const categoriesRouter = require('./categories')
const colorsRouter = require('./colors')

/* GET users listing. */
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/colors', colorsRouter);

module.exports = router;
