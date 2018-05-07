var express = require('express');
var router = express.Router();
const apiRouter = require('../routes/api')

function route(app){
  app.get('/', (req, res) =>{
    res.render('index');
  })


  app.use('/v1/api', apiRouter);
}

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = route;
