const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

router.use(cookieParser());
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    async (req, res) => {
        const validationCheck = validationResult(req);
        if (!validationCheck.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            return res.send('<script>alert("validation failed,plz register again...!");window.location.href = "/register";</script>');

        }

        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
            res.status(404)
            return res.send('<script>alert("User Already Exist...!"); window.location.href = "/register";</script>');

            }
            const hashpassword = await bcrypt.hash(password, 10);
            const NewUser = new User({ name, email, password: hashpassword });
            // console.log(NewUser);
            if (await NewUser.save()) {
                // console.log("User registered successfully...!");
               res.status(200);
              return res.send('<script>alert("validation failed,plz re-login...!"); window.location.href = "/login";</script>');
            } else {
                throw new Error("Registration failed...");

            }
        } catch (error) {
            // console.log(error);
            res.status(400)
            return res.send('<script>alert("Error occurred while account register....!"); window.location.href = "/register";</script>');

        }
    });

router.post('/login',
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                 res.status(400)
                 return res.send('<script>alert("User not found....!"); window.location.href = "/login";</script>');

            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400)
                return res.send('<script>alert("Wrong Password....!"); window.location.href = "/login";</script>');

            } else {
                const token = jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: '1d' });
                res.cookie("userToken", token);
                return res.send('<script>alert("User logged in successfully....!"); window.location.href = "/allblogs";</script>');

            }
        } catch (error) {
            // console.log(error);
            return res.status(500).send("Internal server error.");
        }
    });



router.get("/logout", (req, res) => {
    res.clearCookie("userToken");
    return res.send('<script>alert("User logged out successfully....!"); window.location.href = "/";</script>');
});

module.exports = router;
