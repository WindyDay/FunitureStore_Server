var express = require('express');
var router = express.Router();
const db = require('../../models/db_connect')
const ProductsModel = require('../../models/products')

/* GET users listing. */
router.get('/', function(req, res, next) {
    let page = req.query.page ? req.query.page : 1;
    let maxResults = req.query.maxResults ? req.query.maxResults : 16; //results per page
    console.log('page: %s  - maxResults: %s', page, maxResults);
    const query = ProductsModel.find({});
    query.skip((page-1)*maxResults);
    query.limit(1*maxResults);
    query.select('name oldPrice price thumbnail');

    query.exec((err, productsResult)=>{
        if(!err){
            // console.log(productsResult);
            res.send(productsResult);
            
        }
        else console.log(err);
    })
});
router.get('/:productId', function(req, res, next) {
    var query = ProductsModel.findById(req.params.productId);
    // console.log(req.params.productId);
    query.exec((err, detailResult)=>{
        if(!err){
            // console.log(detailResult);
            res.send(detailResult);
            
        }
    })
});
module.exports = router;
