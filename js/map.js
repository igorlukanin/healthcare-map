var getCoordinates = function(value) {
    return [
        value.координаты[1],
        value.координаты[0]
    ];
};

var getHospitalLocationBalloonContent = function(hospital, location) {
    var hospitalContent = hospital.сайт
        ? '<b><a href="' + hospital.сайт + '" target="_blank">' + hospital.название + '</a></b>'
        : '<b>' + hospital.название + '</b>';

    var typeContent = location.тип.join(', ');

    var addressContent = location.адрес;

    var telephoneContent = location.телефон;

    return hospitalContent + ' — ' + typeContent +
        '<br/>' + addressContent +
        (telephoneContent ? '<br/>' + telephoneContent : '');
};

var getHospitalLocationPreset = function(location) {
    return location.тип.indexOf('стоматология') > -1 ? 'islands#pinkCircleIcon'
        : location.тип.indexOf('скорая помощь') > -1 ? 'islands#orangeCircleIcon'
        : location.тип.indexOf('стационар') > -1 ? 'islands#greenCircleIcon'
        : 'islands#blueCircleIcon';
};

var addOffice = function(map, office) {
    map.geoObjects.add(new ymaps.Placemark(getCoordinates(office), {
        hintContent: office.название,
        balloonContent: '<b>' + office.название + '</b> — наш офис<br/>' + office.адрес
    }, {
        preset: 'islands#redCircleDotIcon'
    }));
};

var addHospitalLocation = function(map, hospital, location) {
    map.geoObjects.add(new ymaps.Placemark(getCoordinates(location), {
        hintContent: hospital.название,
        balloonContent: getHospitalLocationBalloonContent(hospital, location)
    }, {
        preset:getHospitalLocationPreset(location)
    }));
};

var addCity = function(id, city) {
    var map = new ymaps.Map(id, {
        center: getCoordinates(city),
        zoom: 12,
        controls: ['zoomControl', 'trafficControl']
    });

    if (city.офисы !== undefined) {
        city.офисы.forEach(function(office) { addOffice(map, office); });
    }

    city.больницы.forEach(function(hospital) {
        hospital.отделения.forEach(function(location) {
            addHospitalLocation(map, hospital, location);
        });
    });
};
