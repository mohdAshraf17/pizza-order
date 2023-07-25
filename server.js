const express = require('express');
const app = express();
require('dotenv').config()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = 4000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')
const passport = require('passport');
const url = 'mongodb://127.0.0.1:27017/pizza';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('database connected')
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressLayout);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/resources/views'))


app.use(flash())

// let MongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: 'session'
// })
app.use(session({
    secret: 'thisismysecret',
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

require('./app/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})


app.use(express.static('public'))
require('./routes/web')(app)
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})