const mongoose = require('mongoose')
require('dotenv').config();

const mongourl =  process.env.DB_URI;
const mongoDB = async ()=>{
    try {
        await mongoose.connect(mongourl)
         console.log("database connected");
    } catch (error) {
        console.log("some errors",error);
    }
}

module.exports = mongoDB;