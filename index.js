const express = require('express')

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use()

const indexRouter = require('./routers/product');

app.use('/', indexRouter);

app.listen('3000', ()=> {
    console.log('Server sudah berjalan di port 3000')
})