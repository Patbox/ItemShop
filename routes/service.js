const fs = require("fs");
const lvlupApi = require("lvlup-js");
const mysql = require("mysql");

const config = require("../config.json");
const services = require("../services.json");
let purchases = require("../purchases.json");

const pool = require("../utils/pool.js");
const functions = require("../utils/functions.js");
let a = require("../app.js");

const log = functions.log;
const checkConfig = functions.checkConfig;
const checkBreak = functions.checkBreak;

let lvlup = null;
if(config.important.lvluptoken) {
    lvlup = new lvlupApi(config.important.lvluptoken);
}

module.exports = function(app){
    app.get("/usluga/:id", checkBreak, checkConfig, function(req, res, err) {
        if(services[req.params.id]) {
            if(config.important.purchases == "json") {
                let purchases = JSON.parse(fs.readFileSync("./purchases.json"));
                res.render("pages/service", {site: config.sites.shop, general: config.general, navbar: config.navbar, id: req.params.id, service: services[req.params.id], purchases});
            } else if(config.important.purchases == "mysql") {
                pool.getConnection(async function(err, connection) {
                    connection.query(`SELECT * FROM ${config.important.database.table}`, async function(err, purchases, fields) {
                        if(err) {
                            log("Wystąpił problem z połączeniem z bazą danych.\n" + err);
                        }
                        res.render("pages/service", {site: config.sites.shop, general: config.general, navbar: config.navbar, id: req.params.id, service: services[req.params.id], purchases});
                        connection.release();
                    });
                });
            }
        } else {
            return res.status(404).render("pages/404", {site: config.sites.shop, general: config.general, navbar: config.navbar});
        }
    });

    app.post("/usluga/:id", checkBreak, checkConfig, async function(req, res, err) {
        response = {
            name: req.body.name,
            service: req.params.id
        };
        const linkForPayment = await lvlup.createPayment((services[response.service].price).toString(), config.general.url + "platnosc", config.general.url + "platnosc");
        a.cache[linkForPayment.id] = {
            name: response.name,
            service: response.service,
            price: services[response.service].price,
            date: Date.now()
        };
        const checkdetails = "<p class='text-error'>Trwa zakup usługi <b>" + services[response.service].name + "</b> na nick <b>" + response.name + "</b>. Proszę czekać.</p><script>window.location = '" + linkForPayment.url + "'</script>"
        res.render("pages/checking", {site: config.sites.shop, general: config.general, navbar: config.navbar, checkdetails});
    });
}
