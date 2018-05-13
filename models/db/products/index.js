var mongoose = require('mongoose')
var Schema = mongoose.Schema
const CONST = require('../../../constants')

var ProductSchema = new Schema({
    name: {
        type: String,
        // unique: true,
        required: [true, 'Missing product\'s name!'],
        max: 100,
    },
    categories: [{
        type: Schema.ObjectId,
        ref: 'categories',
        required: true,
    }],
    thumbnail: {
        type: String,
        max: 500,
    },
    images: [{
        type: String,
        max: 500,
    }],
    oldPrice: {
        type: Number,
        min: 0,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    modifiedDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
        max: 3000,
    },
    author: {
        type: Schema.ObjectId,
        ref: 'users',
        required: true,
    },
    colors: [{
        type: Schema.ObjectId,
        ref: 'colors',
        required: true
    }]
});
ProductSchema.statics = {
    /**
     * @param  {object} options
     * @param  {function} cb
     */
    load: (options, cb) => {
        let select = options.select || 'name oldPrice price thumbnail categories'
        let page = options.page || CONST.DEFAULT_PAGE
        let maxResults = options.maxResults || CONST.MAX_RESULTS
        let categories = options.categories || null


        let query = productsModel.find()
        query.skip((page - 1) * maxResults);
        query.limit(1 * maxResults);

        let populateQuery = {
            path: 'categories',
            select: 'name -_id',
        }
        if (categories) {
            populateQuery.match = {
                'name': {
                    $in: categories
                }
            };
        }

        query.populate(populateQuery);
        query.select(select);
        query.exec((err, productsResult) => {
            let filteredResult = productsResult.filter(e => e.categories.length)
            cb(err, filteredResult);
        })
    },

    /**
     * @param  {string} id
     * @param  {function} cb
     */
    getById: (id, cb) => {
        return productsModel.findById(id, cb)
            .populate({
                path: 'colors'
            });
    }
}

const productsModel = mongoose.model('products', ProductSchema)
module.exports = productsModel;