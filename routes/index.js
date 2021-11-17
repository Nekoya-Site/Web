const express = require('express')
const router = express.Router()

let controller = require("../controllers/controllers");

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

router.route('/login')
    .get((_req, res) => {
        res.render('pages/login');
    })
    .post((req, res) => {
        controller.login(req.body.email, req.body.password, req.headers['user-agent'], req.headers['x-forwarded-for'] || req.socket.remoteAddress).then(data => {
            console.log(data);
            if (data[0] == 200) {
                console.log(data[1])
                res.render("pages/index");
            } else if (data[0] == 204){
                res.render('pages/login', {
                    companyName : 'SALAH',
                    error : 'Please confirm your email'
                });
            } else {
                res.render('pages/login', {
                    companyName : 'SALAH',
                    error : 'Invalid Email or Password'
                });
            }
        });
    })

router.get('/verify-mail', (req, res) => {
    controller.verify_mail(req.params.token).then(data => {
        if (data == 200) {
            res.render("pages/register-verification-success");
        } else {
            res.render("pages/index");
        }
    })
})

router.get('/forgot-password', (_req, res) => {
    res.render('pages/forgot-password');
})

router.get('/otp', (_req, res) => {
    res.render('pages/otp');
})

router.get('/change-password', (_req, res) => {
    res.render('pages/change-password');
})

router.get('/products', (_req, res) => {
    controller.getProducts().then(data => {
        res.render('pages/products', {data: data});
    })
})

router.get('/product/:id', (req, res) => {
    controller.getProduct(req.params.id).then(data => {
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