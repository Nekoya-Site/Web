const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')

const indexRouter = require('./routes/index');

app.use('/', indexRouter);

app.listen('3000', ()=> {
    console.log('Server sudah berjalan di port 3000')
})