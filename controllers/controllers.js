const axios = require("axios");

let config;
try {
    config = require("../config");
} catch (e) {
    console.log("No config file found");
    process.exit(0);
}

const HOST = config.host + "/api";

function getProducts() {
    return axios
        .get(HOST + "/getproducts")
        .then((response) => response.data)
        .catch((error) => console.log(error));
}

function getProduct(id) {
    return axios
        .get(HOST + "/getproduct", {
            params: {
                id: id
            }
        })
        .then((response) => response.data)
        .catch((error) => console.log(error));
}

function register(email, password, first_name, last_name) {
    let params = new URLSearchParams({
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
    });
    const conf = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    return axios
        .post(HOST + "/register", params, conf)
        .then((response) => response.status)
        .catch((error) => [error.status, []]);
}

function login(email, password, ua, ip) {
    let params = new URLSearchParams({
        email: email,
        password: password,
        ua: ua,
        ip: ip,
    });
    const conf = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    return axios
        .post(HOST + "/login", params, conf)
        .then((response) => [response.status, response.data])
        .catch((error) => [error.status, []]);
}

function verify_mail(token) {
    let params = new URLSearchParams({
        token: token,
    });
    const conf = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    return axios
        .post(HOST + "/verify-mail", params, conf)
        .then((response) => [response.status, response.data])
        .catch((error) => [error.status, []]);
}

function request_reset_password(email) {
    let params = new URLSearchParams({
        email: email,
    });
    const conf = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    };
    return axios
        .post(HOST + "/request-reset-password", params, conf)
        .then((response) => [response.status, response.data])
        .catch((error) => [error.status, []]);
}

function reset_password(
    token,
    password
) {
    let params = new URLSearchParams({
        password: password,
    });
    const conf = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
            token: token,
        }
    };
    return axios
        .post(HOST + "/reset-password", params, conf)
        .then((response) => [response.status, response.data])
        .catch((error) => [error.status, []]);
}

function checkout(
    firstName,
    lastName,
    phoneNumber,
    streetAddress1,
    streetAddress2,
    region,
    province,
    city,
    district,
    subDistrict,
    postalCode,
    logistic,
    data,
    key
) {
    let params = new URLSearchParams({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        streetAddress1: streetAddress1,
        streetAddress2: streetAddress2,
        region: region,
        province: province,
        city: city,
        district: district,
        subDistrict: subDistrict,
        postalCode: postalCode,
        logistic: logistic,
        data: data,
    });
    const conf = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
            key: key,
        }
    };
    return axios
        .post(HOST + "/checkout", params, conf)
        .then((response) => [response.status, response.data])
        .catch((error) => [error.status, []]);
}

function transaction(key) {
    const conf = {
        params: {
            key: key,
        }
    };
    return axios
        .post(HOST + "/transaction", null, conf)
        .then((response) => [response.status, response.data])
        .catch((error) => [error.status, []]);
}

module.exports = {
    getProducts,
    getProduct,
    register,
    login,
    verify_mail,
    request_reset_password,
    reset_password,
    checkout,
    transaction
};