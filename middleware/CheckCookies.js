const checkUserToken = (req,res,next)=>{
    // jb tk cookies clear ni hoga hm /allblogs pr hi rahege
    if(req.cookies.userToken){
         res.redirect('/allblogs')
    }else if(req.cookies.adminToken){
        res.redirect("/admin-page")
    }else{

        next()
    }
}

module.exports=checkUserToken