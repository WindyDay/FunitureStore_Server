var express = require('express');
var router = express.Router();
const apiRouter = require('../routes/api')
const productsRouter = require('./client/products')
const clientRouter = require('./client')

function route(app){
  app.use('/', clientRouter)
  app.use('/v1/api', apiRouter);
}


module.exports = route;
