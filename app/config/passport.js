const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

const init = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'user not found' });
        }
        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'wrong email or password' });
            }
            return done(null, user, { message: 'logged In successfully' });
        } catch {
            return done(null, false, { message: 'something went wrong' });
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async(_id, done) => {
        const user = await User.findById(_id);
        done(null, user)
    })
};

module.exports = init;