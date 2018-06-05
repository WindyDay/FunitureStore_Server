var express = require('express');
var router = express.Router();
const categoriesModel = require('../../models/db/categories')
const auth = require('../authorization');

router.get('/', getAllCategories);
router.post('/', auth.ModAuthorized, addCategory);
router.put('/', auth.ModAuthorized, editCategory);
router.delete('/', auth.AdminAuthorized, deleteCategory);


module.exports = router;

function getAllCategories(req, res, next) {
    categoriesModel.getAll((err, result) => {
        if (err) return res.status(400).send(err);
        res.send(result);
    })
}

function editCategory(req, res, next) {
    categoriesModel.findOneAndUpdate({
            _id: req.body._id
        }, {
            name: req.body.name
        })
        .then(result => res.send(result))
        .catch(err => res.status(400).send(err))
}

function deleteCategory(req, res, next) {
    categoriesModel.findOneAndRemove({
            _id: req.body._id
        })
        .then(result => res.send(result))
        .catch(err => res.status(400).send(err))
}

function addCategory(req, res, next) {
    categoriesModel.create({
            name: req.body.name
        })
        .then(result => res.send(result))
        .catch(err => res.status(400).send(err))
}