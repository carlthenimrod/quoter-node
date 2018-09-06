const express = require('express');
const router = express.Router();
const {authenticate} = require('./../middleware/authenticate');

const {ObjectID} = require('mongodb');
const {User} = require('../models/user');

router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (e) {
		res.status(400).send();
  }
});

router.delete('/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) {
    res.status(400).send();
  }
});

module.exports = router;