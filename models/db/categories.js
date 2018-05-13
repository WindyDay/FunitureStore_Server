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

CategorySchema.statics = {
    getAll: (cb)=>{
        categoryModel.find({}, cb);
    }
}
const categoryModel = mongoose.model('categories', CategorySchema);

module.exports = categoryModel;