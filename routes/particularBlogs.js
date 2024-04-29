const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser')
router.use(cookieParser())


router.get('/myblogs', auth, async (req, res) => {
    try {

        const userId = req.user._id;
        // res.send(userId)
        const userBlogs = await Blog.find({ authorId: userId }).populate('authorId');
        // res.send(userBlogs)

       return res.render('myblogs', { MyBlogsData: userBlogs });
    } catch (err) {
        res.status(500).send('Error fetching blogs');
    }
});

router.get('/addblog', auth, (req, res) => {
   return res.render('addblog')
})

router.post('/addblog', auth, async (req, res) => {
    try {

        const { title, content } = req.body
        const newBlog = new Blog({ title, content });
        newBlog.authorId = req.user.id;
        await newBlog.save()
        if (req.user) {

            const user = await User.findByIdAndUpdate(req.user.id, { '$push': { blogs: newBlog } })
            const author = await User.findById(req.user.id);

            // if (author) {
            //     res.send(author.name);
            // } else {
            //     res.status(404).send("Author not found...!");
            // }
            // console.log(newBlog);
            // console.log(user);
          return  res.redirect('/myblogs')
        }
    } catch (error) {

        console.log(error);
    }


})

router.get('/edit/:_id', auth, async (req, res) => {
    try {
        const { _id } = req.params
        const getEditData = await Blog.findOne({ _id })
        if (!getEditData) {
            return res.status(404).send('Blog not found...!');
        }
      return  res.render("editblog", { editdata: getEditData });
    } catch (error) {
        console.log(err);
    }
})

router.post('/edit/:_id', auth, async (req, res) => {
    try {
        const { _id } = req.params
        const { title, content } = req.body
        const blogData = await Blog.findOne({ _id, authorId: req.user._id })
        if (!blogData) {
            return res.status(404).send('blog not found...!')
        }
       const updatedBlog= await Blog.findByIdAndUpdate(_id, { title, content })
    //    console.log(updatedBlog);
        // console.log("data updated...!");
      return  res.redirect('/myblogs')
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating blog');
    }

})

router.get('/delete/:_id', auth, async (req, res) => {
    try {
        const { _id } = req.params;

        const blogToDelete = await Blog.findOne({ _id, authorId: req.user._id });

        if (!blogToDelete) {
            return res.status(404).send('Blog not found or unauthorized');
        }

        await Blog.deleteOne({ _id });

        await User.findByIdAndUpdate(req.user._id, { '$pull': { blogs: _id } });

        // console.log('Blog deleted successfully');
     return   res.redirect('/myblogs');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting blog');
    }
});

router.get("/readmore/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const getBlog = await Blog.findOne({ _id}).populate('authorId');;
        if (!getBlog) {
            return res.status(404).send('Blog not found');
        }
        res.render("allBlogReadMore", { readMore: getBlog })
    } catch (error) {
        console.error(error);
       return res.status(500).send('Internal Server Error');
    }
});


module.exports = router