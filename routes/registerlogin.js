const bcrypt = require("bcrypt");
const saltRounds = 10;
var nodemailer = require("nodemailer");
var randtoken = require("rand-token");
var db_connect = require("../db.js");

//send email
function sendEmail(email, token) {
  var email = email;
  var token = token;
  var mail = nodemailer.createTransport({
    host: "mail.chocola.dev",
    port: 587,
    secure: false,
    auth: {
      user: "nekoya@chocola.dev",
      pass: "Nekoya123.",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var mailOptions = {
    from: "nekoya@chocola.dev",
    to: email,
    subject: "Account Verification - Nekoya",
    html:
      '<p>Hello!!! Please click this link <a href="http://localhost:3000/verify-email?token=' +
      token +
      '">link</a> to verify your account!!! Thanks!!!</p>',
  };
  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      return 1;
    } else {
      return 0;
    }
  });
}

exports.register = async function (req, res) {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.first_name ||
    !req.body.last_name
  ) {
    // Empty Fields
    res.render("pages/register-error");
  } else {
    db_connect.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email],
      async function (error, response, fields) {
        if (error) {
          // Error
          res.render("pages/register-error");
        } else {
          if (response.length > 0) {
            // Email Exists
            res.render("pages/register-error");
          } else {
            const encryptedPassword = await bcrypt.hash(
              req.body.password,
              saltRounds
            );
            var users = {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: encryptedPassword,
            };
            db_connect.query(
              "INSERT INTO users SET ?",
              users,
              function (error, response, fields) {
                if (error) {
                  console.log("An error has occured...", error);
                  // Error
                  res.render("pages/register-error");
                } else {
                  var email = req.body.email;
                  db_connect.query(
                    'SELECT * FROM users WHERE email ="' + email + '"',
                    function (err, result) {
                      if (err) throw err;
                      console.log(result[0]);
                      if (result.length > 0) {
                        var token = randtoken.generate(20);
                        if (result[0].verify == 0) {
                          var sent = sendEmail(email, token);
                          if (sent != "0") {
                            var data = {
                              token: token,
                            };
                            db_connect.query(
                              'UPDATE users SET ? WHERE email ="' + email + '"',
                              data,
                              function (err, result) {
                                if (err) throw err;
                              }
                            );
                            // Success and has been sent
                            res.render("pages/register-verification-sent");
                          } else {
                            // Error
                            res.render("pages/register-error");
                          }
                        }
                      } else {
                        console.log("2");
                        // Email isnt registered
                        res.render("pages/register-error");
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  }
};

exports.login = async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db_connect.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async function (error, response, fields) {
      const passCheck = await bcrypt.compare(password, response[0].password);
      if (error) {
        res.send({
          code: 400,
          failed: "An error has occured...",
        });
      } else {
        if (response.length > 0) {
          if (passCheck) {
            if (response[0].verify == 0) {
              res.send({
                code: 204,
                success: "Sorry You havent verified your email",
              });
            } else {
              res.send({
                code: 200,
                success: "Login Successful!!",
              });
            }
          } else {
            res.send({
              code: 204,
              success: "Sorry Email and password does not match",
            });
          }
        } else {
          res.send({
            code: 204,
            success: "Sorry Email does not exits",
          });
        }
      }
    }
  );
};

/* verification email link */
exports.verifyemail = function (req, res, next) {
  db_connect.query(
    'SELECT * FROM users WHERE token ="' + req.query.token + '"',
    function (err, result) {
      if (err) throw err;
      console.log(result[0].verify);
      if (result[0].verify == 0) {
        if (result.length > 0) {
          var data = {
            verify: 1,
          };
          db_connect.query(
            'UPDATE users SET ? WHERE email ="' + result[0].email + '"',
            data,
            function (err, result) {
              if (err) throw err;
            }
          );
          res.render("pages/register-verification-completed");
        } else {
          console.log("2");
          res.render("pages/register-verification-completed");
        }
      } else {
        res.render("pages/register-verification-completed");
      }
    }
  );
};
