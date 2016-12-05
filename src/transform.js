const csv = require('ya-csv');
const Promise = require('bluebird');
const yaml = require('yaml-js');
const fs = require('fs');

const csvPath = process.argv[2];
const prefix = process.argv[3] || '';
const outputPrefix = process.argv[4] || '_data/output';

const uriPrefix = 'http://igorlukanin.github.io/healthcare-map/#';

const offices = {
    'Екатеринбург': [{
        название: 'Космонавтов',
        адрес: 'Екатеринбург, пр. Космонавтов 56'
    }, {
        название: 'Мамина-Сибиряка',
        адрес: 'Екатеринбург, Мамина-Сибиряка 41'
    }, {
        название: 'Радищева',
        адрес: 'Екатеринбург, Радищева 28'
    }, {
        название: 'Белинского',
        адрес: 'Екатеринбург, Белинского 41'
    }, {
        название: 'Ульяновская',
        адрес: 'Екатеринбург, Ульяновская 13а'
    }, {
        название: 'Народной Воли',
        адрес: 'Екатеринбург, Народной Воли 19а'
    }, {
        название: 'Циолковского',
        адрес: 'Екатеринбург, Циолковского 27'
    }, {
        название: 'Сибирский тракт',
        адрес: 'Екатеринбург, Сибирский тракт 12/7'
    }, {
        название: 'Татищева',
        адрес: 'Екатеринбург, Татищева 49а'
    }, {
        название: 'Широкая речка',
        адрес: 'Екатеринбург, Малопрудная 5'
    }],
    'Москва': [{
        название: 'Сущевский вал',
        адрес: 'Москва, Сущевский вал 18'
    }, {
        название: 'Озерковская',
        адрес: 'Москва, Озерковская набережная 50 стр.1'
    }, {
        название: 'Пречистенка',
        адрес: 'Москва, Пречистенка 40/2 стр.3'
    }, {
        название: 'Мясницкая',
        адрес: 'Москва, Мясницкая 40 стр.1'
    }, {
        название: 'Хорошевское шоссе',
        адрес: 'Москва, Хорошевское шоссе 12 корп.1'
    }, {
        название: 'Таможенный проезд',
        адрес: 'Москва, Таможенный проезд 6 стр.4'
    }, {
        название: 'Добролюбова',
        адрес: 'Москва, Добролюбова 3 стр.1'
    }, {
        название: 'Варшавское шоссе',
        адрес: 'Москва, Варшавское шоссе 1 стр.6'
    }, {
        название: 'Большая Семеновская',
        адрес: 'Москва, Большая Семеновская 11 стр.5'
    }, {
        название: '1-й Кожевнический переулок',
        адрес: 'Москва, 1-й Кожевнический переулок 6 стр.1'
    }]
};


const readCsv = path => new Promise(resolve => {
    const rows = [];

    csv.createCsvFileReader(path, {
        'separator': ';',
        'quote': '',
        'escape': '',
        'comment': ''
    }).addListener('data', row => {
        rows.push(row.map(value => value.replace(/"/g, '')));
    }).addListener('end', () => {
        resolve(rows);
    });
});

const getHospitalType = type => {
    const types = {
        'Поликлиническое обслуживание': 'поликлиника',
        'Плановая и экстренная стационарная помощь': 'стационар',
        'Стоматологическая помощь': 'стоматология'
    };

    return types[type] || 'поликлиника';
};

const toYamlHospital = hospitals => ({
    название: hospitals[0][0],
    отделения: hospitals.map(hospital => ({
        адрес: hospital[1],
        тип: [ getHospitalType(hospital[3]) ]
    }))
});

const groupByName = hospitals => {
    const groups = {};

    hospitals.forEach(hospital => {
        const name = hospital[0];

        if (groups[name] === undefined) {
            groups[name] = [];
        }

        groups[name].push(hospital);
    });

    return Object.keys(groups).map(name => toYamlHospital(groups[name]));
};

const filterByCityAndProgram = (hospitals, city, program) => {
    const localHospitals = hospitals.filter(hospital =>
        hospital[4] == city && hospital[5] == program);

    return groupByName(localHospitals);
}

const extractCitiesAndPrograms = hospitals => hospitals.reduce((programs, hospital) => {
    const city = hospital[4];
    const program = hospital[5];

    if (city && programs[city] === undefined) {
        programs[city] = {};
    }

    if (city && program && programs[city][program] === undefined) {
        programs[city][program] = {};
    }

    return programs;
}, {});

readCsv(csvPath)
    .then(data => {
        const programs = extractCitiesAndPrograms(data);
        const output = [];

        Object.keys(programs).forEach(city => {
            Object.keys(programs[city]).forEach(program => {
                var entry = {
                    город: city + ' (' + program + (prefix ? '-' + prefix : '') + ')',
                    больницы: filterByCityAndProgram(data, city, program)
                };

                if (offices[city] !== undefined) {
                    entry.офисы = offices[city];
                }

                output.push(entry);
            });
        });

        const links = output.map(entry => uriPrefix + entry.город);

        return {
            output,
            links
        };
    })
    .then(data => {
        fs.writeFileSync(outputPrefix + '.yml', yaml.dump(data.output));
        fs.writeFileSync(outputPrefix + '-links.txt', data.links.join("\n"));
    });
