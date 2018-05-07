//#!/usr/bin / env node

console.log('This script populates some data to your' +
        ' database. Specified database as argument - e.g.: populatedb mongodb://your_user' +
        'name:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process
    .argv
    .slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var md5 = require('md5');

var async = require('async')
var User = require('./users')
var Product = require('./products')
var Order = require('./orders')
var Category = require('./categories')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose
    .connection
    .on('error', console.error.bind(console, 'MongoDB connection error:'));

db.dropDatabase();
console.log('Database was dropped')
console.log('Importing new data...')
var users = []
var products = []
var orders = []
var categories = []
function userCreate(email, password, fullName, phone, avatarURL, birthday, createdDate, role, cb) {
    userDetail = {
        email: email,
        password: md5(password),
        fullName: fullName,
        phone: phone,
        avatarURL: avatarURL,
    }
    if (fullName != false) 
        userDetail.fullName = fullName;
    if (createdDate != false) 
        userDetail.createdDate = createdDate;
    if (avatarURL != false) 
        userDetail.avatarURL = avatarURL;
    if (birthday != false) 
        userDetail.birthday = birthday;
    if (role != false) 
        userDetail.role = role;
    
    var user = new User(userDetail);

    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user)
    });
}

function productCreate(name, categories, thumnail, images, oldPrice, price, modifiedDate, description, author, cb) {
    var productDetail = {
        name: name,
        categories: categories,
        price: price,
        author: author
    };

    if (thumnail != false) 
        productDetail.thumnail = thumnail;
    if (images != false) 
        productDetail.images = images;
    if (oldPrice != false) 
        productDetail.oldPrice = oldPrice;
    if (description != false) 
        productDetail.description = description;
    if (modifiedDate != false) 
        productDetail.modifiedDate = modifiedDate;
    
    product = new Product(productDetail);
    product.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New product: ' + product);
        products.push(product)
        cb(null, product);
    });
}

function categoryCreate(name, cb) {
    var category = new Category({name: name});

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New category: ' + category);
        categories.push(category)
        cb(null, category);
    });
}

function orderCreate(user, product, cb) {
    var order = new Order({user: user, product: product})

    order.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New order: ' + order);
        orders.push(order)
        cb(null, order)
    });
}

function createUsers(cb) {
    async.parallel([
        function (callback) {
            userCreate('001.icetea@gmail.com', '123456', 'Toi La Admin', '01668313970', 'https://media.mnn.com/assets/images/2018/02/AdorableBlackCatLookingAtCameraFromS' +
                    'ofa.jpg.653x0_q80_crop-smart.jpg',
            '1996-08-04', '2018-05-02', 'admin', callback);
        },
        function (callback) {
            userCreate('icecrystal196@gmail.com', '123456', false, '01234567899', false, false, false, false, callback);
        },
        function (callback) {
            userCreate('balabolo@gmail.com', '123456', 'Asimov', '01668313970', 'https://media.mnn.com/assets/images/2018/02/AdorableBlackCatLookingAtCameraFromS' +
                    'ofa.jpg.653x0_q80_crop-smart.jpg',
            false, false, false, callback);
        },
        function (callback) {
            userCreate('002.icetea@gmail.com', '123456', 'I\'m mod', '01668313970', 'https://media.mnn.com/assets/images/2018/02/AdorableBlackCatLookingAtCameraFromS' +
                    'ofa.jpg.653x0_q80_crop-smart.jpg',
            false, false, 'mod', callback);
        },
    ],
    // optional callback
    cb);
}


function createCategories(cb) {
    async.parallel([
        function (callback) {
           categoryCreate('Bàn', callback);
        },
        function (callback) {
           categoryCreate('Ghế', callback);
        },
        function (callback) {
           categoryCreate('Giường', callback);
        },
        function (callback) {
            categoryCreate('Sofa', callback);
        },
        function (callback) {
            categoryCreate('Kệ, tủ', callback);
        },
    ],
    // optional callback
    cb);
}


function createProducts(cb) {
    async.parallel([
        function (callback) {
            productCreate('Ghế đẩu TOTEM', 
            [categories[1]],
            'https://uma.vn/media/catalog/product/cache/2/small_image/230x/9df78eab33525d08d6e5fb8d27136e95/T/O/TOTEM_TOTEM_0000000004469_DINING_ROOM_-_Stools_and_Benches_2095_20160830084401098178.jpg',
            [
                'https://uma.vn/media/catalog/product/cache/2/small_image/230x/9df78eab33525d08d6e5fb8d27136e95/T/O/TOTEM_TOTEM_0000000004469_DINING_ROOM_-_Stools_and_Benches_2095_20160830084401098178.jpg',
                'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/O/TOTEM_TOTEM_0000000004469_DINING_ROOM_-_Stools_and_Benches_2095_20160830084401098178.jpg',
            ], 
            false, 
            199000, 
            false, 
            'Đôn gỗ cao su tự nhiên với kiểu dáng Scandinavian đơn giản, dễ di chuyển và bố trí', 
            users[3], 
            callback);
        },
        function (callback) {
            productCreate('Sofa giường', 
            [categories[2], categories[3]], 
            'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/E/TEMASEK_TEMASEK_0000001076868_LIVING_ROOM_-_Sofa_Beds_12385_20171017080216402758.jpg', 
            [
                'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/E/TEMASEK_TEMASEK_0000001076868_LIVING_ROOM_-_Sofa_Beds_12385_20171017080216402758.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/E/TEMASEK_TEMASEK_0000001076868_LIVING_ROOM_-_Sofa_Beds_12385_20171017080516383060.jpg'
                , 'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/E/TEMASEK_TEMASEK_0000001076868_LIVING_ROOM_-_Sofa_Beds_12385_20171017082116231296.jpg'
                , 'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/E/TEMASEK_TEMASEK_0000001076868_LIVING_ROOM_-_Sofa_Beds_12385_20171017082316980654.jpg'
            ], 
            2500000, 
            1990000, 
            false, 
            'Chiếc sofa "click-clack" có thể mở rộng thành giường trong tích tắc. Sofa giường TEMASEK có khung gỗ chắc chắn và phần đệm êm ái, cho bạn cảm giác thoải mái cả khi ngồi hay nằm. Sản phẩm thích hợp cho căn hộ nhỏ hoặc khi bạn có khách đột xuất.', 
            users[3], 
            callback);
        },
        function (callback) {
            productCreate('Sofa NORMANDY', 
            [categories[3]],  
            'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/N/O/NORMANDY_NORMANDY_0000001053791_LIVING_ROOM_-_Sofas_10078_20160826040210934669.jpg',
            [
                'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/N/O/NORMANDY_NORMANDY_0000001053791_LIVING_ROOM_-_Sofas_10078_20160826040210934669.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/N/O/NORMANDY_NORMANDY_0000001053791_LIVING_ROOM_-_Sofas_10078_20160826041210352064.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/N/O/NORMANDY_NORMANDY_0000001053791_LIVING_ROOM_-_Sofas_10078_20160826041410336831.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/N/O/NORMANDY_NORMANDY_0000001053791_LIVING_ROOM_-_Sofas_10078_20160826041610160733.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/N/O/NORMANDY_NORMANDY_0000001053791_LIVING_ROOM_-_Sofas_10078_20160826040510812552.jpg'

            ], 
            5900000, 
            4290000, 
            false, 
            'Ghế sofa 2 chỗ NORMANDY có thiết kế hiện đại, đẹp mắt với khung gỗ chắc chắn và đệm ngồi êm ái. Hãy kết hợp vài chiếc sofa này với bàn cà phê và ghế bành NORMANDY để tiếp đãi bạn bè và khách quý đến nhà.', 
            users[3], 
            callback);
        },
    ],
    // optional callback
    cb);
}

function createOrders(cb) {
    async.parallel([
        function (callback) {
           orderCreate(users[1], products[0], callback);
        },
        function (callback) {
           orderCreate(users[2], products[0], callback);
        },
        function (callback) {
           orderCreate(users[2], products[1], callback);
        },
    ],
    // optional callback
    cb);
}

async
    .series([
        createUsers, createCategories, createProducts, createOrders
    ],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('No errors');

        }
        // All done, disconnect from database
        mongoose
            .connection
            .close();
    });
