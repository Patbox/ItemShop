//
// https://github.com/0zelot
//
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const moment = require("moment");
const lvlupApi = require("lvlup-js");
const node = require("nodeactyl-beta");
const librcon = require("librcon");
const { Webhook, MessageBuilder } = require("discord-webhook-node");

const utils = require("./utils.js");
const log = utils.log;
const checkConfig = utils.checkConfig;
const checkBreak = utils.checkBreak;

const config = require("./config.json");
const services = require("./services.json");
let purchases = require("./purchases.json");
let cache = {};

const app = express();
const nodeactyl = node.Client;
const hook = new Webhook(config.webhook.url);
let lvlup = null;
if(config.important.lvluptoken) {
    lvlup = new lvlupApi(config.important.lvluptoken);
}

app.use(express.static("assets"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", checkBreak, checkConfig, function(req, res) {
    let purchases = JSON.parse(fs.readFileSync("./purchases.json"));
    fs.readFile(config.rightsidepanel, "utf8", function (err, rightsidepanel) {
        res.render("pages/shop", {site: config.sites.shop, general: config.general, navbar: config.navbar, services, purchases, rightsidepanel});
    });
});

app.get("/usluga" + "/:id", checkBreak, checkConfig, function(req, res, err) {
    if(services[req.params.id]) {
        let purchases = JSON.parse(fs.readFileSync("./purchases.json"));
        res.render("pages/service", {site: config.sites.shop, general: config.general, navbar: config.navbar, id: req.params.id, service: services[req.params.id], purchases});
    } else {
        return res.status(404).render("pages/404", {site: config.sites.shop, general: config.general, navbar: config.navbar});
    }
});

app.post("/usluga" + "/:id", checkBreak, checkConfig, async function(req, res, err) {
    response = {
        name: req.body.name,
        service: req.params.id
    };
    const linkForPayment = await lvlup.createPayment((services[response.service].price).toString(), config.general.url + "platnosc", config.general.url + "platnosc");
    cache[linkForPayment.id] = {
        name: response.name,
        service: response.service,
        price: services[response.service].price,
        date: Date.now()
    };
    const checkdetails = "<p class='text-error'>Trwa zakup usługi <b>" + services[response.service].name + "</b> na nick <b>" + response.name + "</b>. Proszę czekać.</p><script>window.location = '" + linkForPayment.url + "'</script>"
    res.render("pages/checking", {site: config.sites.shop, general: config.general, navbar: config.navbar, checkdetails});
});

app.post("/platnosc", async function(req, res, next) {
    const checkPayment = await lvlup.paymentInfo(req.body.paymentId);
    if(checkPayment.payed !== true) return; 
        if(cache[req.body.paymentId]) {
            let purchases = await JSON.parse(fs.readFileSync("./purchases.json"));
            await purchases.push({
                buyer: cache[req.body.paymentId].name,
                service: cache[req.body.paymentId].service,
                details: req.body.paymentId,
                profit: cache[req.body.paymentId].price,
                date: Date.now()
            });
            fs.writeFileSync("./purchases.json", JSON.stringify(purchases, null, 1));
            if(config.webhook.url) {
                const text = (config.webhook.text).replace("[PLAYER]", cache[req.body.paymentId].name).replace("[SERVICE]", services[cache[req.body.paymentId].service].name);
                const embed = await new MessageBuilder()
                    .setTitle(config.webhook.title)
                    .setURL(config.general.url)
                    .setColor(config.general.color)
                    .setThumbnail(config.general.url + services[cache[req.body.paymentId].service].image)
                    .setDescription(text)
                    .setFooter(config.general.name, config.general.url + config.general.favicon)
                    .setTimestamp();
                await hook.send(embed);
            }
            for(const number in services[cache[req.body.paymentId].service].commands) {
                let command = await services[cache[req.body.paymentId].service].commands[number];
                command = await command.replace("[PLAYER]", cache[req.body.paymentId].name);
                if(config.important.commands == "pterodactyl") {
                    await nodeactyl.sendCommand(config.important.pterodactyl.server, command).then((sendcommand) => {
                        log("Komenda została wykonana.");
                    }).catch((error) => {
                        log("Usługa dla gracza " + cache[req.body.paymentId].name + " nie została aktywowana, ponieważ nie udało się wykonać komendy poprzez pterodactyla:\n" + error);
                    });
                } else if(config.important.commands == "rcon") {
                    try {
                        await librcon.send(command, config.important.rcon.password, config.important.rcon.ip, config.important.rcon.port);
                    } catch(error) {
                        log("Usługa dla gracza " + cache[req.body.paymentId].name + " nie została aktywowana, ponieważ nie udało się wykonać komendy poprzez rcon:\n" + error.message);
                    }
                }
            }
            delete cache[req.body.paymentId];
            log("Aktywowano usługę " + services[cache[req.body.paymentId].service].name + " dla gracza " + cache[req.body.paymentId].name + ".")
        } else {
            log("Usługa nie została aktywowana, ponieważ płatność najprawdopodobniej nie została dokonana.");
        }
    res.end(200);
});

app.get("/platnosc", checkBreak, checkConfig, function(req, res) {
    res.render("pages/done", {site: config.sites.shop, general: config.general, navbar: config.navbar});
});

app.get("/regulamin", checkBreak, checkConfig, function(req, res) {
    fs.readFile(config.termsfile, "utf8", function (err, termsfile) {
        res.render("pages/terms", {site: config.sites.terms, general: config.general, navbar: config.navbar, termsfile});
    });
});

app.use(function(req, res, next) {
    return res.status(404).render("pages/404", {site: config.sites.shop, general: config.general, navbar: config.navbar});
});
  
app.use(function(req, res, next) {
    return res.status(500).render("pages/500", {site: config.sites.shop, general: config.general, navbar: config.navbar});
});

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
});