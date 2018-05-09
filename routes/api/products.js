var express = require('express');
var router = express.Router();
const ProductsModel = require('../../models/db/products')

const {DEFAULT_PAGE, MAX_RESULT} = require('constants');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let page = req.query.page ? req.query.page : DEFAULT_PAGE;
    let maxResults = req.query.maxResults ? req.query.maxResults : MAX_RESULT; //results per page
    let categories = null;

    (req.query.categories && Array.isArray(req.query.categories))? categories = req.query.categories : categories = [req.query.categories];
    // console.log(categories);
    
    let query = ProductsModel.find();
    // query.where('categories').elemMatch({$in:categories})
    query.skip((page-1)*maxResults);
    query.limit(1*maxResults);  

    let populateQuery = {
        path:'categories', 
        select:'name -_id',
    }
    if(!categories){
        populateQuery[match]={'name':{$in:categories}};
    }

    query.populate(populateQuery);
    query.select('name oldPrice price thumbnail categories');
    // query.lean();
    query.exec((err, productsResult)=>{
        if (err) return next(err);

        productsResult = productsResult.filter(e => e.categories.length)
        console.log(productsResult);
        res.send(productsResult);
            
    })
});

router.get('/:productId', function(req, res) {
    var query = ProductsModel.findById(req.params.productId);
    // console.log(req.params.productId);
    query.exec((err, detailResult, next)=>{
        if (err) return next(err);
        // console.log(detailResult);
        res.send(detailResult);
            
    })
});
module.exports = router;
