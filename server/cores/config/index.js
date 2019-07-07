const path = require('path');
const helpers = require('../../helpers/index');
const lodash = require('lodash');


let configs = {};
const configPath = path.join(process.cwd(), 'config/');
const sepRegex = new RegExp(helpers.pregQuote(path.sep), 'g');

helpers.readDirRecursive(configPath)
    .forEach(config => {
        lodash.set(
            configs,
            helpers.removeExt(config.replace(configPath, '')
                .replace(sepRegex, '.')),
            require(config)
        );
    });

module.exports = {
    all() {
        return configs;
    },
    get(config) {
        return lodash.get(configs, config);
    }
};
