var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

const app = express();

const indexRouter = require('./routes/index');
const api = require('./routes/api');

let config;
try {
    config = require("./config");
} catch (e) {
    console.log("No config file found");
    process.exit(0);
}

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api', api);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, HEAD");
    res.header("Access-Control-Allow-Headers", "custId, appId, Origin, Content-Type, Cookie, X-CSRF-TOKEN, Accept, Authorization, X-XSRF-TOKEN, Access-Control-Allow-Origin, X-Requested-With");
    res.header("Access-Control-Expose-Headers", "Authorization, authenticated");
    res.header("Access-Control-Max-Age", "1728000");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.listen(config.port, () => {
    console.log(`Server is running on port : ${config.port}`);
});
module.exports = app;