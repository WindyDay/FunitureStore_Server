let axios = require('axios');
const CONST = require('../../constants');

_axios = axios.create({
    baseURL: CONST.ONL_API_PATH
});

let fetchData = null;


describe('/colors api check', () => {
    it('Loading data', done => {
        function callback(data) {
            fetchData = data;
            done();
        }
        getColors(callback)
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

    function getColors(cb) {
        return _axios.get('/colors').then(res => cb(res.data));
    }
});