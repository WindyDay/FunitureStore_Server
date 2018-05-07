var express = require('express');
var router = express.Router();

function route(app){
  app.get('/', (req, res) =>{
    res.render('index');
  })
  
}

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = route;
