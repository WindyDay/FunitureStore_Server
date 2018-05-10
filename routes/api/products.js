var express = require('express');
var router = express.Router();
const ProductsModel = require('../../models/db/products')

const CONST = require('../../constants');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let page = req.query.page ? req.query.page : CONST.DEFAULT_PAGE;
    let maxResults = req.query.maxResults ? req.query.maxResults : CONST.MAX_RESULT; //results per page
    let categories = null;

    (req.query.categories && Array.isArray(req.query.categories))?  categories = [req.query.categories] : categories = req.query.categories;
    console.log(req.query.categories && Array.isArray(req.query.categories));
    
    let query = ProductsModel.find();
    // query.where('categories').elemMatch({$in:categories})
    query.skip((page-1)*maxResults);
    query.limit(1*maxResults);  

    let populateQuery = {
        path:'categories', 
        select:'name -_id',
    }
    // console.log(categories);
    if(categories){
        populateQuery.match={'name':{$in:categories}};
    }

    query.populate(populateQuery);
    query.select('name oldPrice price thumbnail categories');
    // query.lean();
    query.exec((err, productsResult)=>{
        if (err) return next(err);

        // console.log(productsResult);
        productsResult = productsResult.filter(e => e.categories.length)
        // console.log(productsResult);
        res.send(productsResult);
            
    })
});

router.get('/:productId', function(req, res, next) {
    var query = ProductsModel.findById(req.params.productId);
    query.populate({path: 'colors'});
    // console.log(req.params.productId);
    query.exec((err, detailResult, next)=>{
        if (err) return next(err);
        // console.log(detailResult);
        res.send(detailResult);
            
    })
});
module.exports = router;
