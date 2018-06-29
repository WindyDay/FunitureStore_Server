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
    },

    getProducts_prepareOptions: (req,res)=>{
        let options = {};

        options.page = req.query.page ? req.query.page : CONST.DEFAULT_PAGE;
        options.maxResults = req.query.maxResults ? req.query.maxResults : CONST.MAX_RESULT;
        options.categories = null;
        options.colors = null;
        options.minPrice = req.query.minPrice;
        options.maxPrice = req.query.maxPrice;
        options.nameSort = req.query.nameSort;
        options.priceSort = req.query.priceSort;
        options.searchKey = req.query.searchKey;
        options.viewsSort = req.query.viewsSort;
        options.dateSort = req.query.dateSort;

        //categories query
        if (req.query.categories) {
            if (Array.isArray(req.query.categories))
                options.categories = req.query.categories
            else(options.categories = [req.query.categories])
        } else options.categories = null;

        //colors query
        if (req.query.colors) {
            if (Array.isArray(req.query.colors))
                options.colors = req.query.colors
            else(options.colors = [req.query.colors])
        } else options.colors = null;

        return options;
    },

    addProductFormParseCb: (err, fields, files) => {
        if (err) return res.status(400).send(err);
        if (!req.user) return res.status(400).send('Need to login first')
        let productInfo = {
            name: fields.name,
            oldPrice: fields.oldPrice,
            price: fields.price,
            description: fields.description,
            // author: "5b0c3eb5bfe98174f488b9e7",
            author: req.user._id,
        };
        let deletedImages = fields.deletedImages;
        let categories = fields.categories;
        let colors = fields.colors;
        try {
            if (categories)
                categories = JSON.parse(fields.categories);
            if (colors)
                colors = JSON.parse(fields.colors);
                

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
        
        if (categories) categories = _.flatten([categories]);
        if (colors) colors = _.flatten([colors]);

        productInfo.colors = colors;
        productInfo.categories = categories;
        
        // console.log(fields);
        if (!files.thumbnail || !files.images == undefined) return res.status(400).send('Did not upload enough images')

        Array.isArray(files.thumbnail) ? productInfo.thumbnail = getRelativePath(files.thumbnail[0].path) : productInfo.thumbnail = getRelativePath(files.thumbnail.path);
        Array.isArray(files.images) ? productInfo.images = files.images.map(image => getRelativePath(image.path)) : productInfo.images = [getRelativePath(files.images.path)];

        for (key in productInfo) {
            if (!productInfo[key]) delete productInfo[key];
        }

        productsModel.create(productInfo)
            .then((result) => {
                // console.log(result);
                res.send(result);
            })
            .catch(err => res.status(400).send(err));

        // console.log(productInfo);
    },
    editProductFormParseCb: (err, fields, files) => {
        if (err) return res.status(400).send(err);
        // if (!req.user) return res.send('Need to login first')

        let productInfo = {
            name: fields.name,
            oldPrice: fields.oldPrice,
            price: fields.price,
            description: fields.description,
            // author: req.user._id,
        };
        let deletedImages = fields.deletedImages;
        let categories = fields.categories;
        let colors = fields.colors;
        try {
            if (deletedImages)
                deletedImages = JSON.parse(fields.deletedImages);
            if (categories)
                categories = JSON.parse(fields.categories);
            if (colors)
                colors = JSON.parse(fields.colors);

        } catch (err) {
            console.log(err);
            return res.status(400).send(err)
        }
        // console.log(deletedImages);

        let oldImages = null;
        let newlyAddedImages = [];
        if (categories) categories = _.flatten([categories]);
        if (deletedImages) deletedImages = _.flatten([deletedImages]);
        // console.log('deletedImages.length='+deletedImages.length);
        if (colors) colors = _.flatten([colors]);
        // console.log(fields);
        // if (!editedImagesList.length && !files.images) return res.status(400).send('Did not upload enough images')
        if (files.thumbnail) {
            Array.isArray(files.thumbnail) ? productInfo.thumbnail = getRelativePath(files.thumbnail[0].path) : productInfo.thumbnail = getRelativePath(files.thumbnail.path);
        }

        if (files.images) {
            Array.isArray(files.images) ? files.images.map(image => newlyAddedImages.push(getRelativePath(image.path))) : newlyAddedImages.push(getRelativePath(files.images.path));
        }
        for (key in productInfo) {
            if (!productInfo[key]) delete productInfo[key];
        }

        // productInfo.images = editedImagesList;\♥
        productsModel.findById(fields.productID).lean().exec((err, result) => {
            if (err) return res.status(400).send(err);
            oldImages = result.images;
            productInfo.images = [..._.difference(oldImages, deletedImages), ...newlyAddedImages];
            productInfo.colors = colors;
            productInfo.categories = categories;
            if (!productInfo.images.length) return res.status(400).send('Did not upload enough images')

            // console.log(productInfo);
            let query = {
                _id: fields.productID
            }
            productsModel.updateOne(query, productInfo)
                .then((result) => {
                    // console.log(result);
                    res.send(result);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err)});

        })

        // console.log(productInfo);
    },
    getCountOfProducts: (cb)=>{
        productsModel.count().exec((err, count)=>{
            cb(err, count);
        })
    }
};
function getRelativePath(fullURL) {
    // console.log(fullURL)
    // console.log('/' + fullURL.split(/\/|\\\\/).slice(-2).join('/'))
    return '/' + fullURL.split(/\/|\\\\|\\/).slice(-2).join('/');
}

const productsModel = mongoose.model('products', ProductSchema)
module.exports = productsModel;