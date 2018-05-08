var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    user:{type: Schema.ObjectId, ref: 'users', required: true,},
    product:{type: Schema.ObjectId, ref: 'products', required: true,}
})
module.exports = mongoose.model('orders', OrderSchema);