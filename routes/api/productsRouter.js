var express = require('express');
var router = express.Router();
const productsModel = require('../../models/db/products')
const _ = require('lodash')
const CONST = require('../../constants');
const formidable = require('formidable')
const path = require('path')
const auth = require('../../models/authorization');

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.post('/', auth.ModAuthorized, addProduct);
router.put('/', auth.ModAuthorized, editProduct);
router.delete('/', auth.AdminAuthorized, deleteProduct);


module.exports = router;


function getProducts(req, res, next) {
    let options = productsModel.getProducts_prepareOptions(req, res);

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
    form.parse(req, productsModel.addProductFormParseCb);
}


function editProduct(req, res, next) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '/../../public/upload');
    form.parse(req, editProductFormParseCb);
}

function deleteProduct(req, res, next) {
    if (!req.body.productID) return res.status(400).send('Id not found')
    productsModel.findOneAndRemove({_id:req.body.productID})
        .then((result) => {
            res.send(result);
        })
        .catch(err => res.status(400).send(err))
}