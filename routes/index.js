const express = require("express");
const router = express.Router();

const auth = require("../auth/auth");
let controller = require("../controllers/controllers");

router.get("/", (req, res) => {
    auth.session_converter(req.cookies.session_token).then((key) => {
        if (key != null) {
            res.render("pages/index", {
                loggedIn: 'true'
            });
        } else {
            res.render("pages/index", {
                loggedIn: 'false'
            });
        }
    });
});

router.route("/register")
    .get((req, res) => {
        auth.session_converter(req.cookies.session_token).then((key) => {
            if (key != null) {
                res.redirect("/");
            } else {
                res.render("pages/register");
            }
        });
    })
    .post((req, res) => {
        controller.register(
            req.body.email,
            req.body.password,
            req.body.first_name,
            req.body.last_name
        )
        .then((data) => {
            if (data == 200) {
                res.render("pages/register-verification-sent");
            } else {
                res.redirect("/register");
            }
        });
    });

router.route("/login")
    .get((req, res) => {
        auth.session_converter(req.cookies.session_token).then((key) => {
            if (key != null) {
                res.redirect("/");
            } else {
                res.render("pages/login");
            }
        });
    })
    .post((req, res) => {
        controller.login(
            req.body.email,
            req.body.password,
            req.headers["user-agent"],
            req.headers["x-forwarded-for"] || req.socket.remoteAddress
        )
        .then((data) => {
            if (data[0] == 200) {
                res.cookie('session_token', Buffer.from(JSON.stringify({'user_id': data[1].id, 'session_token': data[1].session_token})).toString('base64'), { maxAge: 2592000000, httpOnly: true });
                res.redirect("/");
            } else if (data[0] == 204) {
                res.render("pages/login", {
                    error: "Please confim your account by checking your email",
                });
            } else if (data[0] == 205) {
                res.render("pages/login", {
                    error: "Wrong Email or Password",
                });
            } else {
                res.render("pages/login", {
                    error: "Wrong Email or Password",
                });
            }
        });
    });

router.get("/verify-mail", (req, res) => {
    controller.verify_mail(req.query.token).then((data) => {
        if (data == 200) {
            res.render("pages/register-verification-success");
        } else {
            res.redirect("/");
        }
    });
});

router.route("/checkout")
    .get((req, res) => {
        auth.session_converter(req.cookies.session_token).then((key) => {
            if (key != null) {
                res.render("pages/checkout", {
                    loggedIn: 'true'
                });
            } else {
                res.redirect("/login");
            }
        });
    })
    .post((req, res) => {
        auth.session_converter(req.cookies.session_token).then((key) => {
            console.log(key);
            if (key != null) {
                controller.checkout(
                    req.body.firstName,
                    req.body.lastName,
                    req.body.phoneNumber,
                    req.body.streetAddress1,
                    req.body.streetAddress2,
                    req.body.region,
                    req.body.province,
                    req.body.city,
                    req.body.district,
                    req.body.subDistrict,
                    req.body.postalCode,
                    req.body.logistic,
                    req.body.data,
                    key
                )
                .then((data) => {
                    if (data[0] == 201) {
                        let total_price = 0;
                        let state = 0;
                        let order_data = JSON.parse(data[1].data);
                        for (let i=0; i<order_data.length; i++) {
                            controller.getProduct(order_data[i].product_id).then((resp) => {
                                state++;
                                total_price += parseInt(resp[0].PRICE * order_data[i].quantity);
                                if (state == order_data.length) {
                                    res.render("pages/payment", {
                                        orderId: data[1].order_id, 
                                        totalPrice: total_price,
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                res.redirect("/login");
            }
        });
    });

router.get("/forgot-password", (_req, res) => {
    res.render("pages/forgot-password");
});

router.get("/otp", (_req, res) => {
    res.render("pages/otp");
});

router.get("/change-password", (_req, res) => {
    res.render("pages/change-password");
});

router.get("/products", (req, res) => {
    auth.session_converter(req.cookies.session_token).then((key) => {
        if (key != null) {
            controller.getProducts().then((data) => {
                res.render("pages/products", {
                    data: data,
                    loggedIn: 'true'
                });
            });
        } else {
            controller.getProducts().then((data) => {
                res.render("pages/products", {
                    data: data,
                    loggedIn: 'false'
                });
            });
        }
    });
});

router.get("/product/:id", (req, res) => {
    auth.session_converter(req.cookies.session_token).then((key) => {
        if (key != null) {
            controller.getProduct(req.params.id).then((data) => {
                res.render("pages/product", {
                    data: data,
                    loggedIn: 'true'
                });
            });
        } else {
            controller.getProduct(req.params.id).then((data) => {
                res.render("pages/product", {
                    data: data,
                    loggedIn: 'false'
                });
            });
        }
    });
});

router.get("/bag", (req, res) => {
    auth.session_converter(req.cookies.session_token).then((key) => {
        if (key != null) {
            res.render("pages/bag", {
                loggedIn: 'true'
            });
        } else {
            res.render("pages/bag", {
                loggedIn: 'false'
            });
        }
    });
});

router.get("/payment", (_req, res) => {
    res.redirect("/");
});

router.get("/about-us", (req, res) => {
    auth.session_converter(req.cookies.session_token).then((key) => {
        if (key != null) {
            res.render("pages/about-us", {
                loggedIn: 'true'
            });
        } else {
            res.render("pages/about-us", {
                loggedIn: 'false'
            });
        }
    });
});

router.get("/faq", (req, res) => {
    auth.session_converter(req.cookies.session_token).then((key) => {
        if (key != null) {
            res.render("pages/faq", {
                loggedIn: 'true'
            });
        } else {
            res.render("pages/faq", {
                loggedIn: 'false'
            });
        }
    });
});

module.exports = router;