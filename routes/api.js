const express = require("express");
const bcrypt = require("bcrypt");
const randtoken = require("rand-token");
const router = express.Router();
const db = require("../modules/db");
const mail = require("../modules/mail");

const saltRounds = 10;

let config;
try {
    config = require("../config");
} catch (e) {
    console.log("No config file found");
    process.exit(0);
}

router.get("/getproducts", (req, res) => {
    const conn = db.connect();
    conn.execute("SELECT * FROM `products`", [], function (err, results) {
        res.json(results);
    });
});

router.get("/getproduct", (req, res) => {
    const conn = db.connect();
    conn.execute(
        "SELECT * FROM `products` WHERE `ID` = ?",
        [req.query.id],
        function (err, results) {
            res.json(results);
        }
    );
});

router.post("/register", async (req, res) => {
    if (
        !req.body.email ||
        !req.body.password ||
        !req.body.first_name ||
        !req.body.last_name
    ) {
        res.status(400);
        res.json({
            message: "Bad Request",
        });
    } else {
        const conn = db.connect();
        conn.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email],
            async function (error, response, fields) {
                if (error) {
                    res.status(400);
                    res.json({
                        message: "Bad Request",
                    });
                } else {
                    if (response.length > 0) {
                        res.status(400);
                        res.json({
                            message: "Bad Request",
                        });
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
                            session: "[]",
                        };
                        conn.query(
                            "INSERT INTO users SET ?",
                            users,
                            function (error, response, fields) {
                                if (error) {
                                    res.status(400);
                                    res.json({
                                        message: "Bad Request",
                                    });
                                } else {
                                    conn.query(
                                        'SELECT * FROM users WHERE email ="' + req.body.email + '"',
                                        function (err, result) {
                                            if (err) {
                                                res.status(400);
                                                res.json({
                                                    message: "Bad Request",
                                                });
                                            }
                                            if (result.length > 0) {
                                                var token = randtoken.generate(20);
                                                if (result[0].verify == 0) {
                                                    let subject = "Account Verification - Nekoya";
                                                    let content = `<p>Hello!!! Please click this link <a href="${config.host}/verify-mail?token=${token}">link</a> to verify your account!!! Thanks!!!</p>`;
                                                    var sent = mail.send(
                                                        req.body.email,
                                                        subject,
                                                        content
                                                    );
                                                    if (sent != "0") {
                                                        var data = {
                                                            token: token,
                                                        };
                                                        conn.query(
                                                            'UPDATE users SET ? WHERE email ="' +
                                                            req.body.email +
                                                            '"',
                                                            data,
                                                            function (err, result) {
                                                                if (err) {
                                                                    res.status(400);
                                                                    res.json({
                                                                        message: "Bad Request",
                                                                    });
                                                                } else {
                                                                    res.status(200);
                                                                    res.json({
                                                                        message: "Register Verification Sent ~",
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    } else {
                                                        res.status(400);
                                                        res.json({
                                                            message: "Bad Request",
                                                        });
                                                    }
                                                }
                                            } else {
                                                res.status(400);
                                                res.json({
                                                    message: "Bad Request",
                                                });
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
});

router.post("/login", async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400);
        res.json({
            message: "Bad Request",
        });
    } else {
        const conn = db.connect();
        conn.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email],
            async function (error, response, fields) {
                if (!response[0]) {
                    res.status(205);
                    res.json({
                        message: "Sorry Your email is not registered in our system",
                    });
                } else {
                    const passCheck = await bcrypt.compare(
                        req.body.password,
                        response[0].password
                    );
                    if (error) {
                        res.status(400);
                        res.json({
                            message: "Bad Request",
                        });
                    } else {
                        if (response.length > 0) {
                            if (passCheck) {
                                if (response[0].verify == 0) {
                                    res.status(204);
                                    res.json({
                                        message: "Sorry You haven't verified your email",
                                    });
                                } else {
                                    let token = randtoken.generate(256);
                                    let session = JSON.parse(response[0].session);
                                    session.push({
                                        user_agent: req.body.ua || req.headers["user-agent"],
                                        ip: req.body.ip ||
                                            req.headers["x-forwarded-for"] ||
                                            req.socket.remoteAddress,
                                        session: token,
                                    });
                                    conn.query(
                                        'UPDATE users SET ? WHERE email ="' + req.body.email + '"', {
                                            session: JSON.stringify(session),
                                        },
                                        function (err, result) {
                                            if (err) {
                                                res.status(400);
                                                res.json({
                                                    message: "Bad Request",
                                                });
                                            } else {
                                                res.status(200);
                                                res.json({
                                                    id: response[0].id,
                                                    first_name: response[0].first_name,
                                                    last_name: response[0].last_name,
                                                    email: response[0].email,
                                                    verify: response[0].verify == 1 ? true : false,
                                                    session_token: token,
                                                });
                                            }
                                        }
                                    );
                                }
                            } else {
                                res.status(401);
                                res.json({
                                    message: "Unauthorized",
                                });
                            }
                        } else {
                            res.status(400);
                            res.json({
                                message: "Bad Request",
                            });
                        }
                    }
                }
            }
        );
    }
});

router.get("/verify-mail", async (req, res) => {
    if (!req.body.token) {
        res.status(400);
        res.json({
            message: "Bad Request",
        });
    } else {
        const conn = db.connect();
        conn.query(
            'SELECT * FROM users WHERE token ="' + req.body.token + '"',
            function (err, result) {
                if (err) {
                    res.status(400);
                    res.json({
                        message: "Bad Request",
                    });
                }
                if (result.length > 0) {
                    if (result[0].verify == 0) {
                        var data = {
                            verify: 1,
                        };
                        db_connect.query(
                            'UPDATE users SET ? WHERE email ="' + result[0].email + '"',
                            data,
                            function (err, result) {
                                if (err) {
                                    res.status(400);
                                    res.json({
                                        message: "Bad Request",
                                    });
                                } else {
                                    res.status(200);
                                    res.json({
                                        message: "Verified ~",
                                    });
                                }
                            }
                        );
                    } else {
                        res.status(403);
                        res.json({
                            message: "Forbidden",
                        });
                    }
                } else {
                    res.status(400);
                    res.json({
                        message: "Bad Request",
                    });
                }
            }
        );
        }
});

router.post("/checkout", async (req, res) => {
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.phoneNumber ||
        !req.body.streetAddress1 ||
        !req.body.streetAddress2 ||
        !req.body.region ||
        !req.body.province ||
        !req.body.city ||
        !req.body.district ||
        !req.body.subDistrict ||
        !req.body.postalCode ||
        !req.body.logistic ||
        !req.body.data
    ) {
        res.status(400);
        res.json({
            message: "Bad Request",
        });
    } else {
        const conn = db.connect();
        var data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            streetAddress1: req.body.streetAddress1,
            streetAddress2: req.body.streetAddress2,
            region: req.body.region,
            province: req.body.province,
            city: req.body.city,
            district: req.body.district,
            subDistrict: req.body.subDistrict,
            postalCode: req.body.postalCode,
            logistic: req.body.logistic,
            paymentMethod: '-',
            data: req.body.data,
            userId: 14,
            paid: '0',
            status: 'pending'
        };
        conn.query(
            "INSERT INTO transactions SET ?",
            data,
            function (error, response, fields) {
                if (error) {
                    res.status(400);
                    res.json({
                        message: "Bad Request",
                    });
                } else {
                    conn.query(
                    'SELECT * FROM transactions WHERE id ="' + response.insertId + '"',
                    function (err, result) {
                        if (err) {
                            res.status(400);
                            res.json({
                                message: "Bad Request",
                            });
                        } else {
                            res.status(201);
                            res.json({
                                'order_id': result[0].id,
                                'data': result[0].data
                            });
                        }
                    });
                }
            }
        );
    }
});

module.exports = router;