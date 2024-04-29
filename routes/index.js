const router = require('express').Router()
const Blog = require('../models/blog')
const Admin = require('../models/admin')
const auth = require('../middleware/auth');
const CheckCookies = require('../middleware/CheckCookies')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/',CheckCookies, async (req, res) => {
    const blogs = await Blog.find({}).populate('authorId')
   return res.render('index', { allBlogs: blogs })
})




router.get('/allblogs', auth, async (req, res) => {
    const blogs = await Blog.find({}).populate('authorId')
   return res.render('allblogs', { allBlogs: blogs })
})


module.exports = router