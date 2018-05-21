var express = require('express');
var router = express.Router();
const productsModel = require('../../models/db/products')
const _ = require('lodash')
const CONST = require('../../constants');
const formidable = require('formidable')
const path = require('path')

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', addProduct);


module.exports = router;


function getProducts(req, res, next) {
    let options = {};

    options.page = req.query.page ? req.query.page : CONST.DEFAULT_PAGE;
    options.maxResults = req.query.maxResults ? req.query.maxResults : CONST.MAX_RESULT;
    options.categories = null;
    options.colors = null;
    options.minPrice = req.query.minPrice;
    options.maxPrice = req.query.maxPrice;
    options.nameSort = req.query.nameSort;
    options.priceSort = req.query.priceSort;
    options.searchKey = req.query.searchKey;

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

function addProduct(req, res, next) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '/../../public/upload');


    form.parse(req, (err, fields, files) => {

        let productInfo = {
            name: fields.name,
            oldPrice: fields.oldPrice,
            price: fields.price,
            modifiedDate: fields.modifiedDate,
            description: fields.description,
            author: fields.author,
        };
        if (fields.categories) productInfo.categories = _.flatten([fields.categories]);
        if (fields.colors) productInfo.colors = _.flatten([fields.colors]);
        // console.log(fields);
        if (err) next(err);
        if (!files.thumbnail || !files.images) next('Did not upload enough images')

        Array.isArray(files.thumbnail) ? productInfo.thumbnail = getRelativePath(files.thumbnail[0].path) : productInfo.thumbnail = getRelativePath(files.thumbnail.path);
        Array.isArray(files.images) ? productInfo.images = files.images.map(image => getRelativePath(image.path)) : productInfo.images = [getRelativePath(files.images.path)];
        
        for (key in productInfo) {
            if (!productInfo[key]) delete productInfo[key];
        }

        productsModel.create(productInfo)
            .then((result) => {
                // console.log(result);
                res.send(result);
            })
            .catch(err => next(err));

        // console.log(productInfo);
    });


    // if(!req.body.categories)
}

function getRelativePath(fullURL){
    return '/' + fullURL.split(/\/|\\\\/).slice(-2).join('/');
}