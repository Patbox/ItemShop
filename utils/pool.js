const mysql = require("mysql");

const config = require("../config.json");

if(config.important.purchases == "mysql") {
    const db = mysql.createPool({
        connectionLimit: 3,
        host: config.important.database.host,
        user: config.important.database.user,
        password: config.important.database.password,
        database: config.important.database.database
    });
    module.exports = db
}

