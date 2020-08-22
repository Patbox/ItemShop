const fs = require("fs");

const config = require("../config.json");
const services = require("../services.json");
const package = require("../package.json");
let purchases = require("../purchases.json");

const functions = require("../utils/functions.js");

const log = functions.log;
const checkConfig = functions.checkConfig;
const checkBreak = functions.checkBreak;

module.exports = function(app){
    app.get("/regulamin", checkBreak, checkConfig, function(req, res) {
        fs.readFile(config.termsfile, "utf8", function (err, termsfile) {
            res.render("pages/terms", {ver: package.version, site: config.sites.terms, general: config.general, navbar: config.navbar, termsfile});
        });
    });
}