var mysql = require('mysql2');
const config = require('../config');

function connect(sql, params) {
    const connection = mysql.createConnection(config.db);
    return connection;
}

module.exports = {
    connect
}