const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://regis:omkar564@registration.ep0lmcc.mongodb.net/?retryWrites=true&w=majority&appName=Registration";
mongoose.connect(mongoURL);
const bcrypt=require("bcrypt")

const db = mongoose.connection;

db.on('connected', () => {
  console.log("Connected to MongoDB Server");
});

db.on('error', (err) => {
  console.error("MongoDB connection error:", err);
});

db.on('disconnected', () => {
  console.log("MongoDB disconnected");
});

const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    password: {
        type: String,
        required: true
    }
});
Loginschema.methods.comparePassword=async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}
// collection part
const Users = new mongoose.model("Users", Loginschema);

module.exports = Users;