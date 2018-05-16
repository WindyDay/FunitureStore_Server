var mongoose = require('mongoose')
var Schema = mongoose.Schema
const CONST = require('../../constants')

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
        let colors = options.colors || null 
        let minPrice = options.minPrice;
        let maxPrice = options.maxPrice;

        let query = productsModel.find()
        // console.log(minPrice);
        if(minPrice) query.where('price').gte(minPrice);
        if(maxPrice) query.where('price').lte(maxPrice);
        query.skip((page - 1) * maxResults);
        query.limit(1 * maxResults);

        let populateCategories = {
            path: 'categories',
            select: 'name -_id',
        }
        if (categories) {
            populateCategories.match = {
                'name': {
                    $in: categories
                }
            };
        }

        let populateColors = {path: 'colors'}
        if (colors) {
            populateColors.match = {
                'name': {
                    $in: colors
                }
            };
        }
        
        query.populate(populateCategories);
        query.populate(populateColors);

        query.select(select);
        query.exec((err, productsResult) => {
            let filteredResult = productsResult.filter(e => e.categories.length &&e.colors.length)
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