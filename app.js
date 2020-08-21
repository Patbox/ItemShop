//
// https://github.com/0zelot
//
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const moment = require("moment");
const node = require("nodeactyl-beta");

const functions = require("./utils/functions.js");
const log = functions.log;
const checkConfig = functions.checkConfig;
const checkBreak = functions.checkBreak;
const checkUpdate = functions.checkUpdate;

const config = require("./config.json");
const services = require("./services.json");
let purchases = require("./purchases.json");
let cache = {};

const app = express();
const nodeactyl = node.Client;

app.use(express.static("assets"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.listen(config.port, function() {
    log("Strona uruchomiona na porcie " + config.port + ".");
    if(config.important.commands == "pterodactyl") {
        nodeactyl.login(config.important.pterodactyl.url, config.important.pterodactyl.key, (logged_in) => {
            if(logged_in == true) {
                log("Pomyślnie połączono z API Pterodactyla.");
            } else {
                log("Nie udało się połączyć z API Pterodactyla.");
            }
        });
    }
    checkUpdate();
    setInterval(async () => {
        checkUpdate();
    }, 86400000);
});

fs.readdirSync("./routes/").forEach(function(file) {
    const name = file.substr(0, file.indexOf("."));
    require("./routes/" + name)(app);
});

app.use(function(req, res, next) {
    return res.status(404).render("pages/404", {site: config.sites.shop, general: config.general, navbar: config.navbar});
});

app.use(function(req, res, next) {
    return res.status(500).render("pages/500", {site: config.sites.shop, general: config.general, navbar: config.navbar});
});