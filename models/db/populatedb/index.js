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
var User = require('../users')
var Product = require('../products')
var Order = require('../orders')
var Category = require('../categories')
var Color = require('../colors')

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
var _users = []
var _products = []
var _orders = []
var _categories = []
var _colors = []

//Create one object
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
        _users.push(user)
        cb(null, user)
    });
}

function productCreate(name, categories, thumbnail, images, oldPrice, price, modifiedDate, description, author, colors, cb) {
    var productDetail = {
        name: name,
        categories: categories,
        price: price,
        author: author,
        colors: colors,
    };

    if (thumbnail != false) 
        productDetail.thumbnail = thumbnail;
    if (images != false) 
        productDetail.images = images;
    if (oldPrice != false) 
        productDetail.oldPrice = oldPrice;
    if (description != false) 
        productDetail.description = description;
    if (modifiedDate != false) 
        productDetail.modifiedDate = modifiedDate;
    if (colors == false){
        productDetail.color = [_colors[1]]
    }
    
    product = new Product(productDetail);
    product.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New product: ' + product);
        _products.push(product)
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
        _categories.push(category)
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
        _orders.push(order)
        cb(null, order)
    });
}

function colorCreate(name, hex, cb){
    var color = new Color({name: name, hex: hex})

    color.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New color: ' + color);
        _colors.push(color)
        cb(null, color)
    });
}

//Create collections
function createUsers(cb) {
    async.series([
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
    async.series([
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
            [_categories[1]],
            'https://uma.vn/media/catalog/product/cache/2/small_image/230x/9df78eab33525d08d6e5fb8d27136e95/T/O/TOTEM_TOTEM_0000000004469_DINING_ROOM_-_Stools_and_Benches_2095_20160830084401098178.jpg',
            [
                'https://uma.vn/media/catalog/product/cache/2/small_image/230x/9df78eab33525d08d6e5fb8d27136e95/T/O/TOTEM_TOTEM_0000000004469_DINING_ROOM_-_Stools_and_Benches_2095_20160830084401098178.jpg',
                'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/T/O/TOTEM_TOTEM_0000000004469_DINING_ROOM_-_Stools_and_Benches_2095_20160830084401098178.jpg',
            ], 
            false, 
            199000, 
            false, 
            'Đôn gỗ cao su tự nhiên với kiểu dáng Scandinavian đơn giản, dễ di chuyển và bố trí', 
            _users[3], 
            [_colors[3], _colors[5]],
            callback);
        },
        function (callback) {
            productCreate('Sofa giường', 
            [_categories[2], _categories[3]], 
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
            _users[3], 
            [_colors[2], _colors[0]],
            callback);
        },
        function (callback) {
            productCreate('Sofa NORMANDY', 
            [_categories[3]],  
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
            _users[3], 
            [_colors[0]],
            callback);
        },
        function (callback) {
            productCreate('Sofa SIMPSON', 
            [_categories[3]],  
            'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/S/I/SIMPSON_SIMPSON_0000001082838_LIVING_ROOM_FURNITURE_-_Sofas_12982_20180404020447280074.jpg',
            [
                'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/S/I/SIMPSON_SIMPSON_0000001082838_LIVING_ROOM_FURNITURE_-_Sofas_12982_20180404020447280074.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/S/I/SIMPSON_SIMPSON_0000001082838_LIVING_ROOM_FURNITURE_-_Sofas_12982_20180404021247578625.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/S/I/SIMPSON_SIMPSON_0000001082838_LIVING_ROOM_FURNITURE_-_Sofas_12982_20180404025646506129.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/S/I/SIMPSON_SIMPSON_0000001082838_LIVING_ROOM_FURNITURE_-_Sofas_12982_20180404020047386946.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/S/I/SIMPSON_SIMPSON_0000001082838_LIVING_ROOM_FURNITURE_-_Sofas_12982_20180404020847674769.jpg'

            ], 
            false, 
            8490000, 
            false, 
            '', 
            _users[3], 
            [_colors[8]],
            callback);
        },
        function (callback) {
            productCreate('Sofa BOGART', 
            [_categories[3]],  
            'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/B/O/BOGART_BOGART_0000001059588_LIVING_ROOM_-_Sofas_10657_20160907074426177994.jpg',
            [
                'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/B/O/BOGART_BOGART_0000001059588_LIVING_ROOM_-_Sofas_10657_20160907074426177994.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/B/O/BOGART_BOGART_0000001059588_LIVING_ROOM_-_Sofas_10657_20160920060856630038.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/B/O/BOGART_BOGART_0000001059588_LIVING_ROOM_-_Sofas_10657_20160907074526219700.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/B/O/BOGART_BOGART_0000001059588_LIVING_ROOM_-_Sofas_10657_20160907074626022197.jpg'

            ], 
            false, 
            8490000, 
            false, 
            'Ghế sofa 3 chỗ BOGART mang phong cách Bắc Âu cổ điển với đặc trưng là lưng tựa chần nút và chân ghế chạm khắc. Khung ghế từ gỗ đặc đem lại sự vững chắc và độ bền cao. Đệm ngồi êm ái từ mút bọc polyester kết hợp lưng tựa chần nút để giữ phom dáng ghế và đưa vẻ đẹp sang trọng vào tổ ấm.', 
            _users[3], 
            [_colors[5]],
            callback);
        },

        function (callback) {
            productCreate('Sofa FUNKY', 
            [_categories[3]],  
            'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/F/U/FUNKY_FUNKY_0000001059755_LIVING_ROOM_-_Sofas_10674_20160907070022317869.jpg',
            [
                'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/F/U/FUNKY_FUNKY_0000001059755_LIVING_ROOM_-_Sofas_10674_20160907070022317869.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/F/U/FUNKY_FUNKY_0000001059755_LIVING_ROOM_-_Sofas_10674_20160912022234609542.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/F/U/FUNKY_FUNKY_0000001059755_LIVING_ROOM_-_Sofas_10674_20160907070122081800.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/image/1800x/040ec09b1e35df139433887a97daa66f/F/U/FUNKY_FUNKY_0000001059755_LIVING_ROOM_-_Sofas_10674_20160907075721798284.jpg'
                ,'https://uma.vn/media/catalog/product/cache/2/thumbnail/100x/9df78eab33525d08d6e5fb8d27136e95/F/U/FUNKY_FUNKY_0000001059755_LIVING_ROOM_-_Sofas_10674_20160907075921361482.jpg'

            ], 
            false, 
            7590000, 
            false,
            `Material:
            Frame: Wood, mdf
            Legs: Metal, powder coated
            Cover: Microfiber',`,
            _users[3], 
            [_colors[2]],
            callback);
        },

    ],
    // optional callback
    cb);
}

function createOrders(cb) {
    async.parallel([
        function (callback) {
           orderCreate(_users[1], _products[0], callback);
        },
        function (callback) {
           orderCreate(_users[2], _products[0], callback);
        },
        function (callback) {
           orderCreate(_users[2], _products[1], callback);
        },
    ],
    // optional callback
    cb);
}

function createColors(cb){
    async.series([
        function (callback) {
           colorCreate('black', '#000000', callback);
        },
        function (callback) {
            colorCreate('White', '#ffffff', callback);
        },
        function (callback) {
            colorCreate('red', '#FF0000', callback);
        },
        function (callback) {
            colorCreate('Yellow', '#FFFF00', callback);
        },
        function (callback) {
            colorCreate('orange', '#FFA500', callback);
        },
        function (callback) {
            colorCreate('Maroon', '#800000', callback);
        },
        function (callback) {
            colorCreate('green', '#008000', callback);
        },
        function (callback) {
            colorCreate('Pink', '#ffc0cb', callback);
        },
        function (callback) {
            colorCreate('blue', '#0000ff', callback);
        },

    ],
    // optional callback
    cb);
}
async
    .series([
        createUsers, createCategories, createColors, createProducts, createOrders
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
