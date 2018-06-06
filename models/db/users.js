var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Missing email!'],
        max: 100,
        lowercase: true, 
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Missing password!'],
        min: [6, 'Password is too short'],
        max: [50, 'Password is too long'],
    },
    fullName: {
        type: String,
        max: 100
    },
    phone:{
        type: String,
        requierd: true,
        max: 20,
    },
    avatarURL:{
        type: String,
        max: 200,
    },
    birthday: {
        type: Date,
    },
    createdDate:{
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        required: [true, 'Missing user\'s role!'],
        enum: ['admin', 'mod', 'user'],
        default: 'user',  
    },
    status: {
        type: String,
        required: [true, 'Missing user\'s status!'],
        enum: ['unverified', 'verified', 'block'],
        default: 'unverified',  
    },
    verifyCode: {
        type: String,
    },
});
UserSchema.statics ={
    matchPassword : (pass1, pass2)=>{
        return pass1===pass2;
    }
}
module.exports = mongoose.model('users', UserSchema);