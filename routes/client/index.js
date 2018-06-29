var express = require('express');
var router = express.Router();
const productsRouter = require('./products');
const userRouter = require('./user')

/* GET users listing. */
router.get('/', renderIndex);
router.use('/products', productsRouter);
router.use('/user', userRouter);

module.exports = router;


function renderIndex(req,res,next){
    res.render('index')
}