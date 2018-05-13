let axios = require('axios');
const CONST = require('../../../constants');

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

let fetchData = null;


describe(CONST.TEST_API_PATH+'/categories api check', async() => {

    beforeAll(async()=>{
        await getCategories();
    })
    it('Loading data', () => {
        expect(fetchData).toBeTruthy();
    });

    it('Loaded at least one category', () => {
        expect(fetchData.length).toBeGreaterThanOrEqual(1);
    })


    it('Containing fields: name', () => {
        let isContain = () => {
            for (e in fetchData) {
                if (e.name == false) return false;
            }
            return true;
        };

        expect(isContain()).toEqual(true);

    })

    function getCategories() {
        return _axios.get('/categories').then(res => fetchData=res.data);
    }
});