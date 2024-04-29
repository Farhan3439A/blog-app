const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
require('dotenv').config();

const AdminAuth = async (req,res,next)=>{

try {
    
    const token = req.cookies.adminToken
    if(!token){
        return res.redirect('/')
    }
    
    const verify = jwt.verify(token,process.env.SECRET_KEY)
    const admin = await Admin.findOne({email:verify.email})
    
    if(!admin){
        throw new Error ("admin not found...!")
        
    }
    req.admin = admin
    next()
} catch (error) {
    return res.status(404).send(error.message); // Send error message
}

}

module.exports = AdminAuth