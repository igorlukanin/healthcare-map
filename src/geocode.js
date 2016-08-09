const request = require('request');
const Promise = require('bluebird');


const path = "https://geocode-maps.yandex.ru/1.x/";


const requestApi = options => new Promise((resolve, reject) => {
    options.format = 'json';
    options.results = 1;

    request({
        uri: path,
        qs: options
    }, (err, res, body) => {
        try {
            const results = JSON.parse(body).response.GeoObjectCollection.featureMember;
            const point = results[0].GeoObject.Point.pos;
            resolve(point.split(' '));
        }
        catch (e) {
            reject(e);
        }
    });
});


const getCoordinates = location => requestApi({ geocode: location });

module.exports = {
    getCoordinates
};