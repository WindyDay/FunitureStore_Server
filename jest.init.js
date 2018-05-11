


const CONST = require('./constants');
const axios = require('axios')
_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

// let fetchDataWithParams = null;
// return _axios.get('/products').then(res => cb(res.data));


// describe(CONST.TEST_API_PATH+'/products api check without params', () => {
//     let fetchData = null;
//     it('Loading data', done => {
//         function cbFunction(data) {
//             fetchData = data;
//             // console.log(fetchData)
//             done();
//         }
//         getProducts(cbFunction)
//     });
async function init(){
    console.log('Initializing before test..');
    // await _axios.get('/products').then(res => console.log(res.data))
    // await _axios.get('/categories').then(res => console.log(res.data))
	console.log('Initialized!');
}
module.exports = init