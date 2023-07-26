const Order = require('../../models/order');

const orderStatusController = () => {
    return {
        async update(req, res) {
            console.log(req.body)
            try{
                await Order.updateOne({ _id: req.body.orderId }, { status: req.body.status })
                return res.redirect('/admin/orders')
            }catch{
                return res.redirect('/admin/orders')
            }
        }
    }
}

module.exports = orderStatusController;