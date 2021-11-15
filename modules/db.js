var mysql = require('mysql2');

try {
    const config = require('../config');
} catch (e) {
    console.log('No config file found');
}

function connect() {
    const connection = mysql.createConnection(config.db);
    return connection;
}

module.exports = {
    connect
}