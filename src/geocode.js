const request = require('sync-request')
const Promise = require('bluebird');

const path = "https://geocode-maps.yandex.ru/1.x/";


const requestApi = options => {
    console.log(options.geocode);

    options.format = 'json';
    options.results = 1;

    var result = request('GET', path, { qs: options });

    if (result.statusCode !== 200) {
        return 200;
    }

    const results = JSON.parse(result.getBody()).response.GeoObjectCollection.featureMember;

    if (results[0] === undefined) {
        return [];
    }

    const point = results[0].GeoObject.Point.pos;
    return point.split(' ');
};


const getCoordinates = location => requestApi({ geocode: location });

module.exports = {
    getCoordinates
};
