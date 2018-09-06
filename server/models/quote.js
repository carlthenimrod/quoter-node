const mongoose = require('mongoose');
const validator = require('validator');

let CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  admin: {
    type: Boolean,
    default: 0
  }
}, {
  timestamps: true
});

let QuoteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  description: {
    type: String,
    required: true,
    minlength: 100,
    trim: true
  },
  status: {
    type: String,
    default: 'new'
  },
  cost: Number,
  comments: [CommentSchema]
}, { 
  timestamps: true
});

let Quote = mongoose.model('Quote', QuoteSchema);
let Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Quote, Comment};