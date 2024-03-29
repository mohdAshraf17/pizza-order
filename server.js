const express = require('express');
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')
const passport = require('passport');
const Emitter = require('events');
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('database connected')
});
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(expressLayout);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/resources/views'))


app.use(flash())
app.use(session({
    secret: process.env.MYSECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.URL
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

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
app.use(express.static('public'))
require('./routes/web')(app)
const server = app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})

// const io = require('socket.io')(server)
// io.on('connection', (socket) => {
//     socket.on('join', (orderId) => {
//         socket.join(orderId)
//         console.log(orderId)
//     })
// })

// eventEmitter.on('orderUpdate', (data) => {
//     io.to(`order_${data.id}`).emit('orderUpdate', data);
// })
