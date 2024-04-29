const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const AdminAuth = require('../middleware/adminAuth');

router.get('/admin-page', AdminAuth, async (req, res) => {
    try {
        const adminName = req.admin.name;

        // Fetch all users
        const users = await User.find();

        // Fetch all blogs
        const blogs = await Blog.find();

        // Map user IDs to blog counts
        const blogCounts = {};
        users.forEach(user => {
            blogCounts[user._id] = user.blogs.length;
        });

        return res.render('adminPage', { adminName: adminName, allUsers: users, allBlogs: blogs, blogCounts: blogCounts });
    } catch (error) {
        console.error('Error fetching users and blogs:', error);
        res.status(500).send("error")
    }
});

router.get('/admin/delete/:_id', AdminAuth, async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).redirect('/admin-page')
        }

        const blogIds = user.blogs;
        await User.findByIdAndDelete(_id);
        await Blog.deleteMany({ _id: { $in: blogIds } });
        res.status(200).redirect('/admin-page');
    } catch (error) {
        console.error('Error deleting user and associated blogs:', error);
        return res.status(500).redirect('/admin-page');
    }
});

module.exports = router;
