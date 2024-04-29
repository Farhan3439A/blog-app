const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    blogs: [{
        type: mongoose.Types.ObjectId,
        ref: "blog"
    }]
})

const User = mongoose.model('user',UserSchema)
module.exports = User