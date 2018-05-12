let axios = require('axios');
const CONST = require('../../constants');

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

let fetchDataWithParams = null;


describe(CONST.TEST_API_PATH + '/products api check without params', async () => {
    let fetchData = null;
    it('Loading data', async () => {
        expect.assertions(1);
        await _axios.get('/products').then(res => fetchData = res.data);
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


describe(CONST.TEST_API_PATH + '/products api check with params', async () => {
    let fetchData = null;
    it('Loading data', async () => {
        expect.assertions(1);
        await _axios.get('/products?categories=Sofa&categories=Giường').then(res => fetchData = res.data);
        expect(fetchData).toBeTruthy();
    });


    it('Loaded at least one product', () => {
        expect(fetchData.length).toBeGreaterThanOrEqual(1);
    })


    it('Containing fields:', () => {
        // console.log(fetchData);
        for (let e of fetchData) {
            expect(e.name).toBeTruthy();
            for (let category of e.categories) {
                expect(category.name).toBeTruthy();
            }
            expect(e.price).toBeTruthy();
            expect(e.thumbnail).toBeTruthy();
        }
    })


    it('Loaded right categories (Sofa || Giường)', () => {
        for (let e of fetchData) {
            // console.log(e.categories)
            for (let category of e.categories) {
                if (!(category.name === 'Sofa' || category.name === 'Giường')) console.log(category)
                expect(category.name === 'Sofa' || category.name === 'Giường').toBeTruthy();
            }
        }
    });

    it('Loaded right categories (Giường)', () => {
        _axios.get('/products?categories=Giường')
            .then(res => (res) => {
                for (let e of res.data) {
                    for (category of e.categories) {
                        expect(category.name === 'Giường').toBeTruthy();
                    }
                }
            });
    });
});