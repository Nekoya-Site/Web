var mysql = require('mysql2');

let config;
try {
    config = require('../config');
} catch (e) {
    console.log('No config file found');
    process.exit(0);
}

function connect() {
    const connection = mysql.createConnection(config.db);
    return connection;
}

function disconnect(connection) {
    connection.end();
}

module.exports = {
    connect,
    disconnect
}