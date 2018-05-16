let axios = require('axios');
const CONST = require('../../../../constants');

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

describe(CONST.TEST_API_PATH + '/products api check with params', () => {
    let fetchData = null;

    beforeAll(async () => {
        await _axios.get('/products?categories=Sofa&categories=Giường&colors=black&colors=maroon')
            .then(res => fetchData = res.data)
            .catch(err => console.log(err));
    })

    it('Loading data', async () => {
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
            for (let color of e.colors) {
                expect(color.name).toBeTruthy();
                expect(color.hex).toBeTruthy();
            }
        }
    })


    it('Loaded right categories (Sofa || Giường)', () => {
        for (let e of fetchData) {
            // console.log(e.categories)
            for (let category of e.categories) {
                // if (!(category.name === 'Sofa' || category.name === 'Giường')) console.log(category)
                expect(category.name === 'Sofa' || category.name === 'Giường').toBeTruthy();
            }
        }
    });

    it('Loaded right categories (Giường)', () => {
        // expect.assertions(1);
        _axios.get('/products?categories=Giường')
            .then((res) => {
                for (let e of res.data) {
                    for (category of e.categories) {
                        expect(category.name === 'Giường').toBeTruthy();
                    }
                }
            })
            .catch(err => expect(false).toBeTruthy());
    });

    it('Loaded right colors (black || maroon)', () => {
        for (let e of fetchData) {
            for (let color of e.colors) {
                expect(color.name === 'black' || color.name === 'maroon').toBeTruthy();
            }
        }
    });

    it('Loaded right colors (black)', () => {
        // expect.assertions(1);
        _axios.get('/products?colors=black')
            .then((res) => {
                for (let e of res.data) {
                    for (let color of e.colors) {
                        expect(color.name === 'black').toBeTruthy();
                    }
                }
            })
            .catch(err => expect(false).toBeTruthy());
    });

    it('Load a product by id', () => {
        _axios.get('/products/' + fetchData[0]._id)
            .then((res) => {
                let data = res.data
                expect(data.categories.length).toBeGreaterThanOrEqual(1);
                expect(data.name).toBeTruthy();
                expect(data.price).toBeGreaterThanOrEqual(0);
                expect(data.images.length).toBeGreaterThanOrEqual(1);
                expect(data.author).toBeTruthy();
            })
            .catch(err => expect(false).toBeTruthy());
    });

    it('Test price filter', () => {
        // expect.assertions(1);
        _axios.get('/products?minPrice=2000000&maxPrice=5000000')
            .then((res) => {
                for (let e of res.data) {
                    expect(e.price >= minPrice).toBeTruthy();
                    expect(e.price <= maxPrice).toBeTruthy();
                }
            })
            .catch(err => expect(false).toBeTruthy());
    });
});