const express = require('express');
const router = express.Router();

const email = require('../config/email');
const {ObjectID} = require('mongodb');
const {Quote, Comment} = require('../models/quote');

router.get('', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.send(quotes);
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const quote = await Quote.findOne({ _id: id });
    if (!quote) return res.status(404).send();
    res.send(quote);
  } catch (e) {
    return res.status(404).send();
  }
});

router.post('/', async (req, res) => {
  const quote = new Quote({
    email: req.body.email,
    description: req.body.description
  });

  try {
    await quote.save();
    await email.send('new_quote', quote.email, {
      email: quote.email,
      description: quote.description
    });
    res.send(quote);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const {email, description, status, cost} = req.body;
    const quote = await Quote.findByIdAndUpdate(id, {
      email,
      description,
      status,
      cost
    }, {
      new: true
    });
    res.send(quote);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/:id/comments', async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }  
  
  try {
    const quote = await Quote.findById(id);
    const comment = new Comment({
      message: req.body.message,
      admin: req.body.admin
    });
    quote.comments.unshift(comment);
    await quote.save();
    res.send(quote.comments.id(comment._id));
  } catch (e) {
    res.status(400).send(e);
  }
});

router.put('/:id/comments/:commentId', async (req, res) => {
  const id = req.params.id;
  const commentId = req.params.commentId;

  if (!ObjectID.isValid(id) || !ObjectID.isValid(commentId)) {
    return res.status(404).send();
  }

  try {
    const quote = await Quote.findById(id);
    const comment = quote.comments.id(commentId);
    comment.message = req.body.message;
    await quote.save();
    res.send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/:id/comments/:commentId', async (req, res) => {
  const id = req.params.id;
  const commentId = req.params.commentId;

  if (!ObjectID.isValid(id) || !ObjectID.isValid(commentId)) {
    return res.status(404).send();
  }

  try {
    const quote = await Quote.findById(id);
    await quote.comments.id(commentId).remove();
    await quote.save();
    res.send(quote);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;