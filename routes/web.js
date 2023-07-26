const homeController = require('../app/http/controllers/homeController');
const cartController = require('../app/http/controllers/cartController');
const authController = require('../app/http/controllers/authController');
const orderController = require('../app/http/controllers/orderContoller');
const guest = require('../app/http/middelwares/guest');
const auth = require('../app/http/middelwares/auth');
const adminController = require('../app/http/controllers/admin/adminController');
const admin = require('../app/http/middelwares/admin');
const orderStatusController = require('../app/http/controllers/orderStatusController')


const webRoutes = (app) => {

    app.get('/', homeController().index);
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().updateRegister)
    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)
    app.post('/logout', authController().logout)
    
    //customer routes
    app.get('/customer/orders', auth, orderController().index);
    app.post('/order',auth, orderController().store);
    app.get('/customer/order/:id',auth, orderController().show);

    //admin routes
    app.get('/admin/orders', admin, adminController().index);
    app.post('/admin/order/status',admin, orderStatusController().update)

};

module.exports = webRoutes;