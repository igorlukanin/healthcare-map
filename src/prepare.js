const api = require('./geocode');
const yaml = require('./yaml');


const sourcePath = process.argv[2];
const resultPath = process.argv[3];

const cities = yaml.read(sourcePath);


cities.forEach(city => {
    city.координаты = api.getCoordinates(city.город);

    if (city.офисы) {
        city.офисы.forEach(office => {
            office.координаты = api.getCoordinates(office.адрес);
        });
    }

    if (city.больницы) {
        city.больницы.forEach(hospital => {
            if (hospital.отделения) {
                hospital.отделения.forEach(location => {
                    location.координаты = api.getCoordinates(location.адрес);

                    if (!location.тип) {
                        location.тип = ['поликлиника'];
                    }
                });
            }
        });
    }
});

yaml.update(resultPath, cities);
