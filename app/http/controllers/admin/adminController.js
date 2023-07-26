const order = require("../../../models/order");

const adminController = () => {

    return {
        async index(req, res) {
            const orders = await order.find({ status: { $ne: 'completed' }}, null, { sort: { 'updatedAt': -1}}).populate( 'customerId', '-password' )
            if(req.xhr) {
                return res.json(orders)
            } else {
                return res.render('admin/orders');
            }
        }
    }
}

module.exports = adminController;