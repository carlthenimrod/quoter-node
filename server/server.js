require('./config/config');

const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

let {mongoose} = require('./db/mongoose');
let {Quote} = require('./models/quote');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('hello world');
});

app.post('/quotes', (req, res) => {

  let quote = new Quote({
    email: req.body.email,
    description: req.body.description
  });

  quote.save().then(quote => {
    res.send(quote);
  }, e => {
    res.status(400).send(e);
  })
});

app.get('/quotes/:id', (req, res) => {
  var id = req.params.id;

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

app.listen(port, () => console.log(`Started on port ${port}`));