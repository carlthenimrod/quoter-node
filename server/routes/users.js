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
    tokens = await user.generateTokens();

    res.send({
      _id: user._id,
      email: user.email,
      ...tokens
    });
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
    const tokens = await user.generateTokens();

    res.send({
      _id: user._id,
      email: user.email,
      ...tokens
    });
  }
  catch (e) {
		res.status(400).send();
  }
});

router.post('/refresh', async (req, res) => {
  const client = req.body.client;
  const refresh_token = req.body.refresh_token;

  try {
    const access_token = await User.refreshToken(refresh_token, client);

    res.send({access_token});
  } catch (e) {
    res.status(401).send();
  }
});

router.delete('/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) {
    res.status(400).send();
  }
});

module.exports = router;