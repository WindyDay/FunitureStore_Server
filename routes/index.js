var express = require('express');
var router = express.Router();
const apiRouter = require('../routes/api')
const productsRouter = require('./products')

function route(app){
  app.get('/', (req, res, next) =>{
    res.render('index');
    next();
  })
  app.use('/products', productsRouter);


  app.use('/v1/api', apiRouter);
}

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


module.exports = route;
