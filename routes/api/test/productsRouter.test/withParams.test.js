let axios = require('axios');
const CONST = require('../../../../constants');

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

describe(CONST.TEST_API_PATH + '/products api check with params', () => {
    let fetchData = null;

    beforeAll(async()=>{
        expect.assertions(1);
        await _axios.get('/products?categories=Sofa&categories=Giường').then(res => fetchData = res.data);
    })
    
    it('Loading data', async () => { expect(fetchData).toBeTruthy();
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
            .then((res) => {
                for (let e of res.data) {
                    for (category of e.categories) {
                        expect(category.name === 'Giường').toBeTruthy();
                    }
                }
            })
            // .catch(err=>console.log(err));
    });

    it('Load a product by id', () => {
        
        _axios.get('/products/'+fetchData[0]._id)
            .then((res) => {
                let data = res.data
                expect(data.categories.length).toBeGreaterThanOrEqual(1);
                expect(data.name).toBeTruthy();
                expect(data.price).toBeGreaterThanOrEqual(0);
                expect(data.images.length).toBeGreaterThanOrEqual(1);
                expect(data.author).toBeTruthy();
            });
    });
});