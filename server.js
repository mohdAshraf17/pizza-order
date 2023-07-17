const express = require('express');
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = 4000;


app.use(express.static('public'))
app.get('/', (req, res) => {
    res.render('home')
})

app.use(expressLayout);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/resources/views'))
app.listen(PORT, ()=> {
    console.log(`running on port ${PORT}`)
})