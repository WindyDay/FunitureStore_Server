let axios = require('axios');
const CONST = require('../../../constants');

_axios = axios.create({
    baseURL: CONST.TEST_API_PATH
});

let fetchData = null;


describe(CONST.TEST_API_PATH+'/colors api check', async() => {
    beforeAll(async()=>{
        await getColors();
    })
    it('Loading data', () => {
        expect(fetchData).toBeTruthy();
    });

    it('Loaded 9 colors', () => {
        expect(fetchData.length).toEqual(9);
    })


    it('Containing fields: name, hex', () => {
        let isContain = () => {
            for (e in fetchData) {
                if (e.name && e.hex == false) return false;
            }
            return true;
        };

        expect(isContain()).toEqual(true);

    })

    function getColors() {
        return _axios.get('/colors').then(res => fetchData = res.data);;
    }
});