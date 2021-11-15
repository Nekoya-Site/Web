const axios = require('axios');

let config;
try {
    config = require('../config');
} catch (e) {
    console.log('No config file found');
    process.exit(0);
}

const HOST = config.host + '/api';

function getProducts() {
    return axios.get(HOST + '/getproducts')
    .then(response => response.data)
    .catch(error => console.log(error))
}

function getProduct(id) {
    return axios.get(HOST + '/getproduct', { params: { id: id } })
    .then(response => response.data)
    .catch(error => console.log(error))
}

module.exports = {
    getProducts,
    getProduct
}