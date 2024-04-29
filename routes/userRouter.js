const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CheckCookies = require('../middleware/CheckCookies')
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser');
require('dotenv').config();
router.use(cookieParser());

router.get('/login',CheckCookies ,(req, res) => {
    res.render('login');
});

router.get('/register',CheckCookies, (req, res) => {
    res.render('register');
});

router.post('/register',CheckCookies,
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    async (req, res) => {
        const validationCheck = validationResult(req);
        if (!validationCheck.isEmpty()) {
            return res.status(400).send('<script>alert("validation failed,plz register again...!");window.location.href = "/register";</script>');

        }

        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
          return res.status(400).send('<script>alert("User Already Exist...!"); window.location.href = "/register";</script>');

            }
            const hashpassword = await bcrypt.hash(password, 10);
            const NewUser = new User({ name, email, password: hashpassword });
            if (await NewUser.save()) {
              return res.status(200).status(200).send('<script>alert("User registered successfully...!"); window.location.href = "/login";</script>');
            } else {
                throw new Error("Registration failed...!");

            }
        } catch (error) {
            return res.status(500).send('<script>alert("Error occurred while account register....!"); window.location.href = "/register";</script>');

        }
    });

router.post('/login',CheckCookies,
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                 return res.status(400).send('<script>alert("User not found....!"); window.location.href = "/login";</script>');

            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send('<script>alert("Wrong Password....!"); window.location.href = "/login";</script>');

            } else {
                const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1d' });
                res.cookie("userToken", token);
                return res.status(200).send('<script>alert("User logged in successfully....!"); window.location.href = "/allblogs";</script>');

            }
        } catch (error) {
            return res.status(500).send('<script>alert("Internal Error....!"); window.location.href = "/";</script>');
        }
    });



router.get("/logout", auth,(req, res) => {
    res.clearCookie("userToken");
    return res.send('<script>alert("User logged out successfully....!"); window.location.href = "/";</script>');
});

module.exports = router;
