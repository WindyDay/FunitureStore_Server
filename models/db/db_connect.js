//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
// var mongoDB = 'mongodb://localhost:27017/furnitureWeb';
var mongoDB = 'mongodb://heroku_dxj6p70x:tpusir8hc7sa07oail7t6m060d@ds217350.mlab.com:17350/heroku_dxj6p70x';

mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    db: db,
}