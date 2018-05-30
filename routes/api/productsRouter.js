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
router.put('/', editProduct);
router.delete('/', deleteProduct);


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
        if (err) return res.status(400).send(err);
        res.send(productsResult);
    })
}

function getProductById(req, res, next) {
    productsModel.getById(req.params.productId, (err, result) => {
        if (err) return res.status(400).send(err);
        res.send(result);
    })
}

function addProduct(req, res, next) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '/../../public/upload');


    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send(err);
        if (!req.user) return res.status(400).send('Need to login first')
        let productInfo = {
            name: fields.name,
            oldPrice: fields.oldPrice,
            price: fields.price,
            description: fields.description,
            // author: "5b0c3eb5bfe98174f488b9e7",
            author: req.user._id,
        };
        let deletedImages = fields.deletedImages;
        let categories = fields.categories;
        let colors = fields.colors;
        try {
            if (categories)
                categories = JSON.parse(fields.categories);
            if (colors)
                colors = JSON.parse(fields.colors);
                

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
        
        if (categories) categories = _.flatten([categories]);
        if (colors) colors = _.flatten([colors]);

        productInfo.colors = colors;
        productInfo.categories = categories;
        
        // console.log(fields);
        if (!files.thumbnail || !files.images == undefined) return res.status(400).send('Did not upload enough images')

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
            .catch(err => res.status(400).send(err));

        // console.log(productInfo);
    });


    // if(!req.body.categories)
}

function getRelativePath(fullURL) {
    // console.log(fullURL)
    // console.log('/' + fullURL.split(/\/|\\\\/).slice(-2).join('/'))
    return '/' + fullURL.split(/\/|\\\\|\\/).slice(-2).join('/');
}

function editProduct(req, res, next) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '/../../public/upload');


    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send(err);
        // if (!req.user) return res.send('Need to login first')

        let productInfo = {
            name: fields.name,
            oldPrice: fields.oldPrice,
            price: fields.price,
            description: fields.description,
            // author: req.user._id,
        };
        let deletedImages = fields.deletedImages;
        let categories = fields.categories;
        let colors = fields.colors;
        try {
            if (deletedImages)
                deletedImages = JSON.parse(fields.deletedImages);
            if (categories)
                categories = JSON.parse(fields.categories);
            if (colors)
                colors = JSON.parse(fields.colors);

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
        // console.log(deletedImages);

        let oldImages = null;
        let newlyAddedImages = [];
        if (categories) categories = _.flatten([categories]);
        if (deletedImages) deletedImages = _.flatten([deletedImages]);
        // console.log('deletedImages.length='+deletedImages.length);
        if (colors) colors = _.flatten([colors]);
        // console.log(fields);
        // if (!editedImagesList.length && !files.images) return res.status(400).send('Did not upload enough images')
        if (files.thumbnail) {
            Array.isArray(files.thumbnail) ? productInfo.thumbnail = getRelativePath(files.thumbnail[0].path) : productInfo.thumbnail = getRelativePath(files.thumbnail.path);
        }

        if (files.images) {
            Array.isArray(files.images) ? files.images.map(image => newlyAddedImages.push(getRelativePath(image.path))) : newlyAddedImages.push(getRelativePath(files.images.path));
        }
        for (key in productInfo) {
            if (!productInfo[key]) delete productInfo[key];
        }

        // productInfo.images = editedImagesList;\♥
        productsModel.findById(fields.productID).lean().exec((err, result) => {
            if (err) return res.status(400).send(err);
            oldImages = result.images;
            productInfo.images = [..._.difference(oldImages, deletedImages), ...newlyAddedImages];
            productInfo.colors = colors;
            productInfo.categories = categories;
            if (!productInfo.images.length) return res.status(400).send('Did not upload enough images')

            // console.log(productInfo);
            let query = {
                _id: fields.productID
            }
            productsModel.updateOne(query, productInfo)
                .then((result) => {
                    // console.log(result);
                    res.send(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err)});

        })

        // console.log(productInfo);
    });
}

function deleteProduct(req, res, next) {
    if (!req.body.productID) return res.status(400).send('Id not found')
    productsModel.findOneAndRemove(req.body.productID)
        .then((result) => {
            res.send(result);
        })
        .catch(err => res.status(400).send(err))
}