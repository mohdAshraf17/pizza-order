const Joi = require('joi');
const Order = require('../models/order');
const moment = require('moment')

const orderController = () => {

    return {
        async index(req, res) {

            const orders = await Order.find({ customerId: req.user._id});

            res.render('order', { orders, moment })
        },
        async store(req, res) {
            //validate request
            const storeSchema = new Joi.object({
                phone: Joi.string().min(10).max(10).required(),
                address: Joi.string().required()
            });
            
            const { error } = storeSchema.validate(req.body);
            
            if(error) {
                req.flash('error', error.message);
                return res.redirect('/cart');
            }

            const { phone, address } = req.body;

            const order = await Order.create({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            })
            
            req.flash('error', 'ordered successfully');
            return res.redirect('/customer/orders');
        }
    }


}

module.exports = orderController;