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
    }],
    quantitySold:{
        type: Number,
        min: 0,
        required: true,
        default: 0
    },
    views:{
        type: Number,
        min: 0,
        required: true,
        default: 0
    }
});
ProductSchema.statics = {
    /**
     * @param  {object} options
     * @param  {function} cb
     */
    load: (options, cb) => {
        let select = options.select || 'name oldPrice price thumbnail categories views'
        let page = options.page || CONST.DEFAULT_PAGE
        let maxResults = options.maxResults || CONST.MAX_RESULTS
        let categories = options.categories || null
        let colors = options.colors || null
        let minPrice = options.minPrice;
        let maxPrice = options.maxPrice;
        let nameSort = options.nameSort * 1;
        let priceSort = options.priceSort * 1;
        let searchKey = options.searchKey;
        let viewsSort = options.viewsSort;
        let dateSort = options.dateSort;


        let query = productsModel.find()
        if (minPrice) query.where('price').gte(minPrice);
        if (maxPrice) query.where('price').lte(maxPrice);
        query.skip((page - 1) * maxResults);
        query.limit(1 * maxResults);
        // console.log(nameSort);
        if (nameSort) query.sort({
            name: nameSort
        })
        if (priceSort) query.sort({
            price: priceSort
        })
        if (viewsSort) query.sort({
            views: viewsSort
        })
        if (dateSort) query.sort({
            modifiedDate: dateSort
        })
        if (searchKey) query.where({
            'name': new RegExp(searchKey, ["i"])
        })

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

        let populateColors = {
            path: 'colors'
        }
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
        return query.exec((err, productsResult) => {
            let filteredResult = productsResult.filter(e => e.categories.length && e.colors.length)
            if (cb) cb(err, filteredResult);
        })
    },

    /**
     * @param  {string} id
     * @param  {function} cb
     */
    getById: (id, cb) => {
        return productsModel.findByIdAndUpdate(id, {$inc: { views: 1 }}, cb)
            .populate({
                path: 'colors categories'
            });
    }
}

const productsModel = mongoose.model('products', ProductSchema)
module.exports = productsModel;