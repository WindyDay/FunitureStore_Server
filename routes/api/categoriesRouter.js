var express = require('express');
var router = express.Router();
const CategoriesModel = require('../../models/db/categories')

router.get('/', getAllCategories);


function getAllCategories(req, res, next) {
    CategoriesModel.getAll((err, result) => {
        if (err) next(err);
        res.send(result);
    })
}
module.exports = router;