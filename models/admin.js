const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
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
})

const AdminData= mongoose.model('admin',AdminSchema)
module.exports=AdminData