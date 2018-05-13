var express = require('express');
var router = express.Router();
const productsModel = require('../../models/db/products')

const CONST = require('../../constants');

/* GET users listing. */
router.get('/', function (req, res, next) {
    let page = req.query.page ? req.query.page : CONST.DEFAULT_PAGE;
    let maxResults = req.query.maxResults ? req.query.maxResults : CONST.MAX_RESULT; //results per page
    let categories = null;

    if (req.query.categories) {
        if (Array.isArray(req.query.categories))
            categories = req.query.categories
        else(categories = [req.query.categories])
    } else categories = null;
    // (console.log(req.query.categories && Array.isArray(req.query.categories)));
    // console.log(categories);

    let query = productsModel.find();
    // query.where('categories').elemMatch({$in:categories})
    query.skip((page - 1) * maxResults);
    query.limit(1 * maxResults);

    let populateQuery = {
        path: 'categories',
        select: 'name -_id',
    }
    if (categories) {
        populateQuery.match = {
            'name': {
                $in: categories
            }
        };
    }

    query.populate(populateQuery);
    query.select('name oldPrice price thumbnail categories');
    // query.lean();
    query.exec((err, productsResult) => {
        if (err) return next(err);

        // console.log(productsResult);
        productsResult = productsResult.filter(e => e.categories.length)
        // console.log(productsResult);
        res.send(productsResult);

    })
});

router.get('/:productId', getProductById);

function getProductById(req, res, next) {
    productsModel.getById(req.params.productId, (err, result) => {
        if (err) return next(err);
        res.send(result);
    })
}
module.exports = router;