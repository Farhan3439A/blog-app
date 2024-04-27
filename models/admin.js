const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        require:true,
        unique:true
    },
    isAdmin:{
        type:Boolean,
        default:false,
        require:true
    }
})

const AdminData= mongoose.model('admin',AdminSchema)
module.exports=AdminData