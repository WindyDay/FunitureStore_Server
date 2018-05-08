var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        // unique: true,
        required: [true, 'Missing product\'s name!'],
        max: 100,
    },
    categories: [{type: Schema.ObjectId, ref: 'categories', required: true,}],
    thumbnail: {
        type: String,
        max: 500,
    },
    images:[{
        type: String,
        max: 500,
    }],
    oldPrice:{
        type: Number,
        min: 0,
    },
    price:{
        type: Number,
        min: 0,
        required: true,
    },
    modifiedDate:{
        type: Date, 
        required: true,
        default: Date.now,
    },
    description:{
        type: String,
        max: 3000,
    },
    author:{
        type: Schema.ObjectId,
        ref: 'users',
        required: true,
    },
});

module.exports = mongoose.model('products', ProductSchema);