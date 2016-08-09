const api = require('./geocode');
const yaml = require('./yaml');


const apiDelayMs = 2000;

const sourcePath = process.argv[2];
const resultPath = process.argv[3];

const cities = yaml.read(sourcePath);


cities.forEach(city => {
    api.getCoordinates(city.город).then(c => city.координаты = c);

    if (city.офисы) {
        city.офисы.forEach(office => {
            api.getCoordinates(office.адрес).then(c => office.координаты = c);
        });
    }

    if (city.больницы) {
        city.больницы.forEach(hospital => {
            if (hospital.отделения) {
                hospital.отделения.forEach(location => {
                    api.getCoordinates(location.адрес).then(c => location.координаты = c);

                    if (!location.тип) {
                        location.тип = ['поликлиника'];
                    }
                });
            }
        });
    }
});

setTimeout(() => yaml.update(resultPath, cities), apiDelayMs);