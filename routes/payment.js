const fs = require("fs");
const mysql = require("mysql");
const lvlupApi = require("lvlup-js");
const librcon = require("librcon");
const { Webhook, MessageBuilder } = require("discord-webhook-node");

const config = require("../config.json");
const services = require("../services.json");
let purchases = require("../purchases.json");

const pool = require("../utils/pool.js");
const functions = require("../utils/functions.js");
const s = require("../routes/service.js");
const a = require("../app.js");

const log = functions.log;
const checkConfig = functions.checkConfig;
const checkBreak = functions.checkBreak;

const hook = new Webhook(config.webhook.url);
let lvlup = null;
if(config.important.lvluptoken) {
    lvlup = new lvlupApi(config.important.lvluptoken);
}

module.exports = function(app){
    app.post("/platnosc", async function(req, res, next) {
        const checkPayment = await lvlup.paymentInfo(req.body.paymentId);
        if(checkPayment.payed !== true) return; 
            if(s.cache[req.body.paymentId]) {
                if(config.important.purchases == "json") {
                    let purchases = await JSON.parse(fs.readFileSync("./purchases.json"));
                    await purchases.push({
                        buyer: cache[req.body.paymentId].name,
                        service: cache[req.body.paymentId].service,
                        details: req.body.paymentId,
                        profit: cache[req.body.paymentId].price,
                        date: Date.now()
                    });
                    fs.writeFileSync("./purchases.json", JSON.stringify(purchases, null, 1));
                } else if(config.important.purchases == "mysql") {
                    pool.getConnection(function(err, connection) {
                        const query = `INSERT into ${config.important.database.table} (
                            buyer,
                            service,
                            details,
                            profit,
                            date
                            ) Values (?,?,?,?,NOW())`;
                        const params = [s.cache[req.body.paymentId].name, s.cache[req.body.paymentId].service, req.body.paymentId, s.cache[req.body.paymentId].price];
                        connection.query(query, params, (err, result) => {
                            if(err) {
                                log("Wystąpił problem z połączeniem z bazą danych.\n" + err);
                            }
                            connection.release();
                        });
                    });
                }
                if(config.webhook.url) {
                    const text = (config.webhook.text).replace("[PLAYER]", s.cache[req.body.paymentId].name).replace("[SERVICE]", services[s.cache[req.body.paymentId].service].name);
                    const embed = await new MessageBuilder()
                        .setTitle(config.webhook.title)
                        .setURL(config.general.url)
                        .setColor(config.general.color)
                        .setThumbnail(config.general.url + services[s.cache[req.body.paymentId].service].image)
                        .setDescription(text)
                        .setFooter(config.general.name, config.general.url + config.general.favicon)
                        .setTimestamp();
                    await hook.send(embed);
                }
                for(const number in services[s.cache[req.body.paymentId].service].commands) {
                    let command = await services[s.cache[req.body.paymentId].service].commands[number];
                    command = await command.replace("[PLAYER]", s.cache[req.body.paymentId].name);
                    if(config.important.commands == "pterodactyl") {
                        await nodeactyl.sendCommand(config.important.pterodactyl.server, command).then((sendcommand) => {
                            log("Komenda została wykonana.");
                        }).catch((error) => {
                            log("Usługa dla gracza " + s.cache[req.body.paymentId].name + " nie została aktywowana, ponieważ nie udało się wykonać komendy poprzez pterodactyla:\n" + error);
                        });
                    } else if(config.important.commands == "rcon") {
                        try {
                            await librcon.send(command, config.important.rcon.password, config.important.rcon.ip, config.important.rcon.port);
                        } catch(error) {
                            log("Usługa dla gracza " + s.cache[req.body.paymentId].name + " nie została aktywowana, ponieważ nie udało się wykonać komendy poprzez rcon:\n" + error.message);
                        }
                    }
                }
                delete s.cache[req.body.paymentId];
                log("Aktywowano usługę " + services[cache[req.body.paymentId].service].name + " dla gracza " + s.cache[req.body.paymentId].name + ".")
            } else {
                log("Usługa nie została aktywowana, ponieważ płatność najprawdopodobniej nie została dokonana.");
            }
        res.end(200);
    });
    
    app.get("/platnosc", checkBreak, checkConfig, function(req, res) {
        res.render("pages/done", {site: config.sites.shop, general: config.general, navbar: config.navbar});
    });
}
