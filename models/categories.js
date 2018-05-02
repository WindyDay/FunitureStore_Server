var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        max: 100,
    },
});

module.exports = mongoose.model('Categories', CategorySchema);