const mongoose = require('mongoose');
const validator = require('validator');

const CommentSchema = new mongoose.Schema({
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

const QuoteSchema = new mongoose.Schema({
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

const Quote = mongoose.model('Quote', QuoteSchema);
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Quote, Comment};