var express = require('express');
var router = express.Router();
const productsRouter = require('./productsRouter')
const categoriesRouter = require('./categoriesRouter')
const colorsRouter = require('./colorsRouter')
const userRouter = require('./userRouter')

/* GET users listing. */
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/colors', colorsRouter);
router.use('/user', userRouter);

module.exports = router;
