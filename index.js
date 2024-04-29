const express = require('express')
const app = express()
const mongoDB = require('./db')
require('dotenv').config();
mongoDB();
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.set("view engine", 'ejs')

app.use(require('./routes/index'))
app.use(require('./routes/userRouter'))
app.use(require('./routes/particularBlogs'))
app.use(require('./routes/adminRouter'))
app.use(require('./routes/adminPageRoute'))


app.listen(3000,()=>{
    console.log("listning on port 3000");
});