var mysql = require("mysql");
var db_connect = mysql.createConnection({
  host: "ruka.moe.team",
  user: "admin_nekoya",
  password: "Nekoya123.",
  database: "admin_nekoya",
});
db_connect.connect(function (err) {
  if (!err) {
    console.log("Database Connected !!!");
  } else {
    console.log("There was a problem connecting to the database ....");
  }
});

module.exports = db_connect;
