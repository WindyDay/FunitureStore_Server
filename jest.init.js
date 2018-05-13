


const CONST = require('./constants');
const axios = require('axios')

// var userArgs = process.argv

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

async function init(){
    console.log('\nInitializing before test..');
        console.log('Fetching some data to make sure server was waked up...')
        await _axios.get('/colors').then(res =>console.log('Server is OK'))
	console.log('Initialized!');
}
module.exports = init

// Instead of waiting a fix, you can simulate globalSetup and globalTeardown by this way :

// import * as jest from 'jest';

// // globalSetup
// async function init() {
//     console.log('Initialization');

//     // Do all your initialization stuff 
//     // I use a setTimeout to simulate true async
//     return new Promise<void>((resolve, reject) => {
//         setTimeout(() => {
//             console.log('Init finished');
//             resolve();        
//         }, 1000)
//     });
// }

// // globalTeardown
// async function afterTests() {
//     console.log('End of tests - Execute something');
// }

// init()
//     .then(jest.run)
//     .then(afterTests)
//     .catch((e) => console.error(e));
// Output :

// > ts-node ./testInit.ts 
// Initialization
// Init finished
//  PASS  ./test1.test.ts
//   Tests
//     ✓ Async test (1009ms)
//     ✓ Sync test (1ms)

// Test Suites: 1 passed, 1 total
// Tests:       2 passed, 2 total
// Snapshots:   0 total
// Time:        2.036s
// Ran all test suites.
// End of tests - Execute something
// I hope this gonna help you ! :)