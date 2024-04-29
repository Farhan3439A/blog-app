const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const AdminAuth = require('../middleware/adminAuth')

router.get('/admin-page',AdminAuth,async (req,res)=>{
    try {
        const adminName = req.admin.name;

        const users= await User.find()
        return res.render('adminPage', { adminName: adminName, allUsers: users });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send("error")
    }
})

router.get('/admin/delete/:_id',AdminAuth,async (req,res)=>{
    try {
        const {_id}=req.params
        const user = await User.findById({_id})
        if(!user){
            return res.status(404).redirect('/admin-page')
        }
        const blogIds=user.blogs
        await User.findByIdAndDelete({_id})
        await Blog.deleteMany({_id:{$in:blogIds}})
        res.status(200).redirect('/admin-page')



    } catch (error) {
        return res.status(500).redirect('/admin-page')

     }
})

module.exports= router
