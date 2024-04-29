const router = require('express').Router();
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { body, validationResult } = require('express-validator');
const CheckCookies = require('../middleware/CheckCookies')
const adminAuth= require('../middleware/adminAuth')
router.use(cookieParser())
require('dotenv').config();

const SecretKey = process.env.SECRET_KEY

router.get('/admin-login',CheckCookies ,(req, res) => {
    res.render('adminLogin');
});

router.get('/admin-register',CheckCookies, (req, res) => {
    res.render('adminRegister');
});

router.post('/admin-register',
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('key').notEmpty(),
    async (req, res) => {
        const validationCheck = validationResult(req);
        if (!validationCheck.isEmpty()) {
            return res.status(400).send('<script>alert("validation failed,plz register admin again...!");window.location.href = "/admin-register";</script>');

        }
        try {
            const { name, email, password, key } = req.body;
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).send('<script>alert("Admin Already Exist...!"); window.location.href = "/admin-register";</script>');
            }
            const hashpassword = await bcrypt.hash(password, 10)
            if (key!==SecretKey) {
                return res.status(400).send('<script>alert("Wrong Key....!"); window.location.href = "/admin-register";</script>');

            }
            const NewAdmin = new Admin({ name, email, password: hashpassword })
            if (await NewAdmin.save()) {
                console.log(NewAdmin);

                return res.status(200).send('<script>alert("Admin registered successfully...!"); window.location.href = "/admin-login";</script>');

            } else {
                throw new Error("Admin Registration failed...!");
            }

        } catch (error) {
            return res.status(500).send('<script>alert("Error occurred while admin registration....!"); window.location.href = "/";</script>')
        }

    })

    router.post('/admin-login',CheckCookies,
    body('email').isEmail(),
    body('password').notEmpty(),
   async (req,res)=>{
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
             return res.status(400).send('<script>alert("Admin not found....!"); window.location.href = "/admin-login";</script>');

        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).send('<script>alert("Wrong Password....!"); window.location.href = "/admin-login";</script>');

        } else {
            const token = jwt.sign({ email}, process.env.SECRET_KEY, { expiresIn: '1d' });
            res.cookie("adminToken", token);
            return res.status(200).send('<script>alert("Admin logged in successfully....!"); window.location.href = "/admin-page";</script>');
        }
    } catch (error) {
        return res.status(500).send('<script>alert("Internal Error....!"); window.location.href = "/";</script>');

    }
    })

    router.get('/admin-logout',adminAuth,(req,res)=>{
        res.clearCookie("adminToken")
        return res.status(200).send('<script>alert("Admin logged out successfully....!"); window.location.href = "/";</script>');

    })


module.exports = router
