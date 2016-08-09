const fs = require('fs');
const yaml = require('yaml-js');


const read = path => yaml.load(fs.readFileSync(path));

const readKey = (path, key) => readAll(path)[key];

const update = (path, value) => fs.writeFileSync(path, yaml.dump(value));

const updateKey = (path, key, value) => {
    var data = readAll(path);
    data[key] = value;
    updateAll(path, data);
};


module.exports = {
    read,
    readKey,
    update,
    updateKey
};