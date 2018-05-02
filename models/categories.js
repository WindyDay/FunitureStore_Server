var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        max: 100,
    },
    imageURL:[{
        type: String,
        max: 200,
    }],
    description:{
        type: String,
        max: 3000,
    },
});

module.exports = mongoose.model('Categories', CategorySchema);