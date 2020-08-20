const fs = require("fs");
const mysql = require("mysql");

const config = require("../config.json");
const services = require("../services.json");
let purchases = require("../purchases.json");

const pool = require("../utils/pool.js");
const functions = require("../utils/functions.js");

const log = functions.log;
const checkConfig = functions.checkConfig;
const checkBreak = functions.checkBreak;

module.exports = function(app){
    app.get("/", checkBreak, checkConfig, function(req, res) {
        fs.readFile(config.rightsidepanel, "utf8", async function (err, rightsidepanel) {
            if(config.important.purchases == "json") {
                let purchases = JSON.parse(fs.readFileSync("./purchases.json"));
                res.render("pages/shop", {site: config.sites.shop, general: config.general, navbar: config.navbar, services, purchases, rightsidepanel});
            } else if(config.important.purchases == "mysql") {
                pool.getConnection(async function(err, connection) {
                    connection.query(`SELECT * FROM ${config.important.database.table}`, async function(err, purchases, fields) {
                        if(err) {
                            log("Wystąpił problem z połączeniem z bazą danych.\n" + err);
                        }
                        res.render("pages/shop", {site: config.sites.shop, general: config.general, navbar: config.navbar, services, purchases, rightsidepanel});
                        connection.release();
                    });
                });
            }
        });
    });
}