let axios = require('axios');
const CONST = require('../../../../constants');

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

describe(CONST.TEST_API_PATH + '/products api check without params', () => {
    let fetchData = null;

    beforeAll(async () => {
        await _axios.get('/products')
            .then(res => fetchData = res.data)
            .catch(err=>console.log(err))
    })

    it('Loading data', () => {
        expect(fetchData).toBeTruthy();
    });


    it('Loaded at least one product', () => {
        expect(fetchData.length).toBeGreaterThanOrEqual(1);
    })


    it('Containing fields: name, categories, price, thumbnail', () => {
        for (let e of fetchData) {
            expect(e.name).toBeTruthy();
            expect(e.categories).toBeTruthy();
            expect(e.price).toBeTruthy();
            expect(e.thumbnail).toBeTruthy();
        }

    })
});