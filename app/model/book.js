const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  sellerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true,
  },
  name:{
    type:String,
    require:true
  },
  rating:{
    type:Number,
    default:0
  },
  description:{
    type:String
  },
  tags:[ String ],
  image:{
    type:String,
    default:'img/default_book.jpg'
  }
},{timestapms:true});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;