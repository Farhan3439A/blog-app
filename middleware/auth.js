const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            return res.redirect('/');
        }

        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ email:verify.email});

        if (!user) {
         throw new Error ('user not found...!')

        }

        req.user = user;
        next();
    } catch (err) {
       return res.status(404).send(err)
    }
};

module.exports = auth;
