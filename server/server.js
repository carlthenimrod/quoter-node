require('./config/config');

const express = require('express');
const app = express();

const port = process.env.PORT;

app.get('/', function (req, res) {
  res.send('hello world');
});

app.listen(port, () => console.log(`Started on port ${port}`));