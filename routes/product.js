const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('pages/product')
})

router.get(('/successadd'), (req, res) => {
    res.render('pages/success-add')
})

router.get('/bag', (req, res) => {
    res.render('pages/bag')
})

router.get('/checkout', (req, res) => {
    res.render('pages/checkout')
})

router.get('/notifpay', (req, res) => {
    res.render('pages/notif-pay')
})

router.get('/payment', (req, res) => {
    res.render('pages/payment')
})

module.exports = router;