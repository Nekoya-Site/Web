const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('pages/index');
})

router.get('/login', (req, res) => {
    res.render('pages/login');
})

router.get('/forgot-password', (req, res) => {
    res.render('pages/forgot-password');
})

router.get('/otp', (req, res) => {
    res.render('pages/otp');
})

router.get('/product', (req, res) => {
    res.render('pages/product')
})

router.get(('/successadd'), (req, res) => {
    res.render('pages/successadd')
})

router.get('/bag', (req, res) => {
    res.render('pages/bag')
})

router.get('/checkout', (req, res) => {
    res.render('pages/checkout')
})

router.get('/notifpay', (req, res) => {
    res.render('pages/notifpay')
})

router.get('/payment', (req, res) => {
    res.render('pages/payment')
})

module.exports = router;