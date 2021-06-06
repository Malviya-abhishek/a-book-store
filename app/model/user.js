const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{ type: String, require: true },
  email:{type: String, require: true, unique:true},
  password:{type: String, require: true},
  role:{type: String, default: "customer"},
  phone:{type:String}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;