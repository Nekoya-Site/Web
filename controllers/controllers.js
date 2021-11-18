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
    .get(HOST + "/getproduct", { params: { id: id } })
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
  return axios
    .get(HOST + "/verify-mail", { params: { token: token } })
    .then((response) => response.status)
    .catch((error) => console.log(error));
}

module.exports = {
  getProducts,
  getProduct,
  register,
  login,
  verify_mail,
};
