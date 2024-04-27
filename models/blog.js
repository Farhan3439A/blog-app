const mongoose = require('mongoose');

const options = { timeZone: 'Asia/Kolkata', hour12: true };

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    postedAt: {
        type: String,
        default: function() {
            return new Date().toLocaleString('en-US', options);
        }
    },
    authorId:{
        type: mongoose.Types.ObjectId,
        ref: "user",
        
    }
});

const BlogData = mongoose.model('blog', BlogSchema);
module.exports = BlogData;
