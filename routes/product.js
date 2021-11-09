const express = require('express')

const router = express.Router()

router.get('/', (_req, res) => {
    res.render('pages/product')
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

module.exports = router;