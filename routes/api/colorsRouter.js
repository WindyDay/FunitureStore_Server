var express = require('express');
var router = express.Router();
const colorsModel = require('../../models/db/colors')

/* GET colors listing. */
router.get('/', getAllColors);

function getAllColors(req, res, next) {
    colorsModel.getAll((err, result) => {
        if (err) return next(err);
        return res.send(result);
    });
}

module.exports = router;