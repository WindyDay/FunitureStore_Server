var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ColorSchema = new Schema({
    name: {
        type: String,
        // unique: true,
        required: true,
        max: 100,
    },
    hex: {
        type: String,
        unique: true,
        max: 7,
        uppercase: true, 
        required: true,
        validate:{
            validator: (value)=>{
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
            },
            message: '{VALUE} is not a valid hex code!'
        }
    },
});

module.exports = mongoose.model('Colors', ProductSchema);