const express = require('express');
const bcrypt = require("bcrypt");
const randtoken = require("rand-token");
const router = express.Router();
const db = require('../modules/db');
const mail = require('../modules/mail');

const saltRounds = 10;

router.get('/getproducts', (req, res) => {
    const conn = db.connect();
    conn.execute('SELECT * FROM `products`', [], function (err, results) {
        res.json(results);
    });
})

router.get('/getproduct', (req, res) => {
    const conn = db.connect();
    conn.execute('SELECT * FROM `products` WHERE `ID` = ?', [req.query.id], function (err, results) {
        res.json(results);
    });
})

router.post('/register', async (req, res) => {
    console.log(req.body.email);
    if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) {
        console.log('memek');
        res.status(400);
        res.json({
            'message': 'Bad Request'
        })
    } else {
        const conn = db.connect();
        console.log('lel');
        conn.query("SELECT * FROM users WHERE email = ?", [req.body.email], async function (error, response, fields) {
            if (error) {
                console.log('lol');
                res.status(400);
                res.json({
                    'message': 'Bad Request'
                })
            } else {
                if (response.length > 0) {
                    console.log('lul');
                    res.status(400);
                    res.json({
                        'message': 'Bad Request'
                    })
                } else {
                    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    var users = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        email: req.body.email,
                        password: encryptedPassword,
                    };
                    conn.query("INSERT INTO users SET ?", users, function (error, response, fields) {
                        if (error) {
                            console.log(error);
                            res.status(400);
                            res.json({
                                'message': 'Bad Request'
                            })
                        } else {
                            var email = req.body.email;
                            conn.query('SELECT * FROM users WHERE email ="' + email + '"', function (err, result) {
                                if (err) {
                                    console.log(err);
                                    res.status(400);
                                    res.json({
                                        'message': 'Bad Request'
                                    })
                                }
                                if (result.length > 0) {
                                    var token = randtoken.generate(20);
                                    if (result[0].verify == 0) {
                                        var sent = mail.send(email, token);
                                        if (sent != "0") {
                                            var data = {
                                                token: token,
                                            };
                                            conn.query('UPDATE users SET ? WHERE email ="' + email + '"', data, function (err, result) {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(400);
                                                    res.json({
                                                        'message': 'Bad Request'
                                                    })
                                                }
                                            });
                                            res.status(200);
                                            res.json({
                                                'message': 'Register Verification Sent ~'
                                            })
                                        } else {
                                            console.log('hmm');
                                            res.status(400);
                                            res.json({
                                                'message': 'Bad Request'
                                            })
                                        }
                                    }
                                } else {
                                    console.log('hmmx');
                                    res.status(400);
                                    res.json({
                                        'message': 'Bad Request'
                                    })
                                }
                                }
                            );
                        }
                    });
                }
            }
        });
    }
});

module.exports = router;