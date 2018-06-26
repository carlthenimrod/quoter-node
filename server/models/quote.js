const mongoose = require('mongoose');
const validator = require('validator');

let QuoteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
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
  }
});

let Quote = mongoose.model('Quote', QuoteSchema);

module.exports = {Quote};