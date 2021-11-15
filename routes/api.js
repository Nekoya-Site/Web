const express = require('express')
const router = express.Router()
const db = require('../modules/db')

router.get('/getproducts', (req, res) => {
    const conn = db.connect();
    conn.execute('SELECT * FROM `products`', [], function(err, results) {
        res.json(results);
    });
})

router.get('/getproduct', (req, res) => {
    const conn = db.connect();
    conn.execute('SELECT * FROM `products` WHERE `ID` = ?', [req.query.id], function(err, results) {
        res.json(results);
    });
})

module.exports = router;