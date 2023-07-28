const Joi = require('joi');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const authController = () => {
    return {
        register(req, res) {
            res.render('register')
        },
        async updateRegister(req, res, next) {
            const { name, email, password } = req.body;
            const registerSchema = Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required(),
            });

            const { error } = registerSchema.validate(req.body);
            if (error) {
                req.flash('error', error.message);
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register')
            }

            try {
                const match = await User.exists({ email: req.body.email });
                if (match) {
                    req.flash('error', 'email is already exist');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register')
                }
            } catch {
                req.flash('error', 'something went wrong!');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register')
            }
            const HashPassword = await bcrypt.hash(password, 10);
            try {
                const user = await User.create({
                    name,
                    email,
                    password: HashPassword
                })
                return res.redirect('/login')
            } catch {
                req.flash('error', 'something went wrong!');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register')
            }
        },

        login(req, res) {
            res.render('login')
        },
        postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err);
                    }
                    if (req.user.role == 'admin') {
                        return res.redirect('/admin/orders')
                    }
                    return res.redirect('/customer/orders')
                })

            })(req, res, next)
        },
        logout(req, res) {
            req.logout((err) => {
                if (err) { return next(err); }
                return res.redirect('/login')
            });
        }
    }
};

module.exports = authController;