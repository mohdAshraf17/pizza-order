const express = require('express');
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = 4000;


app.use(expressLayout);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/resources/views'))

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.render('home');
})
app.get('/cart', (req, res) => {
    res.render('cart')
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/register', (req, res) => {
    res.render('register');
})
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})