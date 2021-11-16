const express = require('express')
const router = express.Router()
var registerlogin = require("./registerlogin");

let controller = require("../controllers/controllers");

router.post("/login", registerlogin.login);
router.get("/verify-email", registerlogin.verifyemail);

router.get('/', (_req, res) => {
    res.render('pages/index');
})

router.route('/register')
    .get((_req, res) => {
        res.render('pages/register');
    })
    .post((req, res) => {
        controller.register(req.body.email, req.body.password, req.body.first_name, req.body.last_name).then(data => {
            if (data == 200) {
                res.render("pages/register-verification-sent");
            } else {
                res.render("pages/register-error");
            }
        });
    })

router.get('/login', (_req, res) => {
    res.render('pages/login');
})

router.get('/forgot-password', (_req, res) => {
    res.render('pages/forgot-password');
})

router.get('/otp', (_req, res) => {
    res.render('pages/otp');
})

router.get('/products', (_req, res) => {
    controller.getProducts().then(data => {
        res.render('pages/products', {data: data});
    })
})

router.get('/product/:id', (req, res) => {
    product_controller.getProduct(req.params.id).then(data => {
        res.render('pages/product', {data: data});
    })
})

router.get(('/successadd'), (_req, res) => {
    res.render('pages/success-add')
})

router.get('/bag', (_req, res) => {
    res.render('pages/bag')
})

router.get('/checkout', (_req, res) => {
    res.render('pages/checkout')
})

router.get('/notifpay', (_req, res) => {
    res.render('pages/notif-pay')
})

router.get('/payment', (_req, res) => {
    res.render('pages/payment')
})

router.get('/about-us', (_req, res) => {
    res.render('pages/about-us')
})

module.exports = router;