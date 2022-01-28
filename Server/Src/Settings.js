const ini = require("ini");
const fs = require("fs");

class Settings {
    constructor() {
        this.config = {};
    }

    LoadSettingsInI() {
        this.config = ini.parse(fs.readFileSync('./AppData/Settings.ini', 'utf-8'));
    }
}

module.exports = Settings;