const express = require('express')
const router = express.Router()
const db = require('../modules/db')

router.get('/getproducts', (req, res) => {
    const conn = db.connect();
    conn.execute('SELECT * FROM `product`', [], function(err, results) {
        res.json(results);
    });
})

router.get('/getproduct', (req, res) => {
    const conn = db.connect();
    conn.execute('SELECT * FROM `product` WHERE `model` = ?', [req.query.id], function(err, results) {
        res.json(results);
    });
})

module.exports = router;