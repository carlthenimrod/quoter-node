const express = require('express');
const router = express.Router();

const email = require('../config/email');
const {ObjectID} = require('mongodb');
const {Quote} = require('../models/quote');

router.get('/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Quote.findOne({
    _id: id
  }).then(quote => {
    if (!quote) {
      return res.status(404).send();
    }

    res.send(quote);
  }).catch(e => {
    res.status(400).send();
  });
});

router.post('/', (req, res) => {
  let quote = new Quote({
    email: req.body.email,
    description: req.body.description
  });

  quote.save().then(quote => {
    email.send('new_quote', quote.email, {
      email: quote.email,
      description: quote.description
    })
    .then(() => {
      res.send(quote);
    })
    .catch(e => {
      res.status(400).send(e);
    });
  }, e => {
    res.status(400).send(e);
  });
});

module.exports = router;