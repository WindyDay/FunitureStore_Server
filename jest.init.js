


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
    console.log('\nInitializing before test..');
        console.log('Fetching some data to make sure server was waked up...')
        await _axios.get('/colors').then(res => console.log(console.log('Server is OK')))
	console.log('Initialized!');
}
module.exports = init