var express = require('express');
var router = express.Router();
const CategoriesModel = require('../../models/db/categories')

router.get('/', (req, res)=>{
    const query = CategoriesModel.find({});
    query.select('name');

    query.exec((err, result)=>{
        if(!err){
            res.send(result);
        }
    })
});

module.exports = router;
