const router = require('express').Router()
const Blog = require('../models/blog')
const auth = require('../middleware/auth');
const preventauth = require('../middleware/preventAuth')
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/', preventauth, async (req, res) => {
    const blogs = await Blog.find({}).populate('authorId')
    res.render('index', { allBlogs: blogs })
})
router.get('/allblogs', auth, async (req, res) => {
    const blogs = await Blog.find({}).populate('authorId')
    res.render('allblogs', { allBlogs: blogs })
})

module.exports = router