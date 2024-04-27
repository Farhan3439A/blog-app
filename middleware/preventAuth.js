const preventauth = (req,res,next)=>{
    if(req.cookies.userToken){
        return res.redirect('/allblogs')
    }else{
        next()
    }
}

module.exports=preventauth