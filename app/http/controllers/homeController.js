const menu = require('../../models/menu')

const homeController = () => {
    return {
        async index(req, res) {
            const menus = await menu.find()
            res.render('home', { menus })
        }
    }
};

module.exports = homeController