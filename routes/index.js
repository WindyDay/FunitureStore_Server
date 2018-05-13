var express = require('express');
var router = express.Router();
const apiRouter = require('../routes/api')
const productsRouter = require('./client/products')

function route(app){
  app.get('/', renderIndex)
  app.use('/products', productsRouter);
  app.use('/v1/api', apiRouter);
}


module.exports = route;

renderIndex = (req, res, next) =>{
  res.render('index');
  next();
}