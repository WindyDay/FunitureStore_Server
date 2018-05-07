var express = require('express');
var router = express.Router();
const db = require('../../models/db_connect')
const ProductsModel = require('../../models/products')

/* GET users listing. */
router.get('/', function(req, res, next) {
    var query = ProductsModel.find({});
    query.select('name oldPrice price imageURL');

    query.exec((err, productsResult)=>{
        if(!err){
            // console.log(productsResult);
            res.send(productsResult);
            
        }
    })
});

module.exports = router;
