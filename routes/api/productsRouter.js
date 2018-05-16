var express = require('express');
var router = express.Router();
const productsModel = require('../../models/db/products')

const CONST = require('../../constants');

router.get('/', getProducts);
router.get('/:productId', getProductById);

function getProducts(req, res, next) {
    let options = {};

    options.page = req.query.page ? req.query.page : CONST.DEFAULT_PAGE;
    options.maxResults = req.query.maxResults ? req.query.maxResults : CONST.MAX_RESULT;
    options.categories = null;
    options.colors = null;
    
    //categories query
    if (req.query.categories) {
        if (Array.isArray(req.query.categories))
            options.categories = req.query.categories
        else(options.categories = [req.query.categories])
    } else options.categories = null;

    //colors query
    if (req.query.colors) {
        if (Array.isArray(req.query.colors))
            options.colors = req.query.colors
        else(options.colors = [req.query.colors])
    } else options.colors = null;

    productsModel.load(options, (err, productsResult) => {
        if (err) return next(err);
        res.send(productsResult);
    })
}

function getProductById(req, res, next) {
    productsModel.getById(req.params.productId, (err, result) => {
        if (err) return next(err);
        res.send(result);
    })
}
module.exports = router;