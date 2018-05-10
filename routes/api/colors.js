var express = require('express');
var router = express.Router();
const colorsModel = require('../../models/db/products/colors')

/* GET colors listing. */
router.get('/', (req,res, next)=>{
    let query = colorsModel.find();

    query.exec((err, result)=>{
        if(err) return next(err);

        return result;
    })
});

module.exports = router;
