require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Quote} = require('./models/quote');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('hello world');
});

app.post('/quotes', (req, res) => {

  let quote = new Quote({
    email: req.body.email,
    description: req.body.description
  });

  quote.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  })
});

app.listen(port, () => console.log(`Started on port ${port}`));