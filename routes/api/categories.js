var express = require('express');
var router = express.Router();
const CategoriesModel = require('../../models/db/categories')

router.get('/', getAllCategories);


function getAllCategories(req, res){
    CategoriesModel
    .find()
    .exec((err, result)=>{
        if(!err){
            res.send(result);
        }
    })
}
module.exports = router;
