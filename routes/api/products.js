var express = require('express');
var router = express.Router();
// const db = require('../../models/db/db_connect')
const ProductsModel = require('../../models/db/products')

const {DEFAULT_PAGE, MAX_RESULT} = require('constants');

/* GET users listing. */
router.get('/', function(req, res) {
    let page = req.query.page ? req.query.page : DEFAULT_PAGE;
    let maxResults = req.query.maxResults ? req.query.maxResults : MAX_RESULT; //results per page

    // console.log(req.query);
    const query = ProductsModel.find({});
    query.skip((page-1)*maxResults);
    query.limit(1*maxResults);
    query.select('name oldPrice price thumbnail');

    query.exec((err, productsResult)=>{
        if(!err){
            // console.log(productsResult);
            res.send(productsResult);
            
        }
        // else console.log(err);
    })
});

router.get('/:productId', function(req, res) {
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
