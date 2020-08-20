const moment = require("moment");

const index = require("../app.js");

const config = require("../config.json");
const services = require("../services.json");

async function checkConfig(req, res, next) {
    let error = null;
    if(!config.general.url || !config.general.name || !config.general.color || !config.general.server_address || !config.important.lvluptoken) {
        error = 1;
    } else if(config.important.commands == "rcon" && (!config.important.rcon.ip || !config.important.rcon.port || !config.important.rcon.password)) {
        error = 2.1;
    } else if(config.important.commands == "pterodactyl" && (!config.important.pterodactyl.url || !config.important.pterodactyl.key || !config.important.pterodactyl.server)) {
        error = 2.2;
    } else if(config.important.commands !== "pterodactyl" && config.important.commands !== "rcon") {
        error = 2.3;
    } else if(config.important.purchases == "mysql" && !config.important.database.host || !config.important.database.user || !config.important.database.password || !config.important.database.database || !config.important.database.table) {
        error = 5;
    } else {
        let serviceerror = false;
        for(const service in services) {
            if(!services[service].name || !services[service].description || !services[service].image || !services[service].price || !services[service].commands || typeof(services[service].price) !== "number") {
                error = 3;
                serviceerror = true;
                break;
            } else if((services[service].name).length >= config.general.service_name_limit) {
                error = 4;
                serviceerror = true;
                break;
            }
        }
        if(error == null && serviceerror == false) return next();
    }
    await res.render("pages/error", {site: config.sites.break, general: config.general, navbar: config.navbar, error: error});
    log("Poczas próby załadowania strony wystąpił błąd (" + error + "). Na stronie pojawiła się informacja z instrukcją naprawy błędu.")
}

async function checkBreak(req, res, next) {
    if(config.break == false) return next();
    await res.render("pages/break", {site: config.sites.break, general: config.general, navbar: config.navbar});
}

async function log(text) {
    console.log("» [" + moment(Date.now()).locale("pl").format("DD.MM.YYYY HH:mm")+ "] " + text + "");
}

module.exports = {log, checkConfig, checkBreak}