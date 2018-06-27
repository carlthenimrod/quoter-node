require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

let {mongoose} = require('./db/mongoose');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('hello world');
});

app.use('/', routes);

app.listen(port, () => console.log(`Started on port ${port}`));