const homeController = require('../app/controller/homeController');
const cartController = require('../app/controller/cartController');
const authController = require('../app/controller/authController');
const orderController = require('../app/controller/orderContoller');
const auth = require('../app/middleware/auth');


const webRoutes = (app) => {

    app.get('/', homeController().index);
    app.get('/login', auth, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', auth, authController().register)
    app.post('/register', authController().updateRegister)
    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)
    app.post('/logout', authController().logout)
    
    //customer routes
    app.get('/customer/orders', orderController().index);
    app.post('/order', orderController().store);

};

module.exports = webRoutes;