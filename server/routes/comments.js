const express = require('express');
const router = express.Router();

const {ObjectID} = require('mongodb');
const {Quote, Comment} = require('../models/quote');

router.post('/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Quote.findById(id).then(quote => {

    const comment = new Comment({
      message: req.body.message,
      admin: req.body.admin
    });

    quote.comments.push(comment);
    
    quote.save().then(quote => {
      res.send(quote);
    },
    e => {
      res.status(400).send(e);
    });
  },
  e => {
    res.status(400).send(e);
  });
});

module.exports = router;