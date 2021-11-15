var mysql = require('mysql2');
const config = require('../conf');

function connect() {
    const connection = mysql.createConnection(config.db);
    return connection;
}

module.exports = {
    connect
}