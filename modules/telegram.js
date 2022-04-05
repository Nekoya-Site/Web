const axios = require("axios");

let config;
try {
    config = require("../config");
} catch (e) {
    console.log("No config file found");
    process.exit(0);
}

const TG_API = "https://api.telegram.org/bot"
const TG_BOT_TOKEN = config.telegram;

const TG_URL = TG_API + TG_BOT_TOKEN;

function send(to, text) {
    const params = {
        chat_id: to,
        text: text,
        parse_mode: 'HTML'
    }
    return axios
        .get(TG_URL + "/sendMessage", { params })
        .then((response) => response.data)
        .catch((error) => console.log(error));
}

module.exports = {
    send
}