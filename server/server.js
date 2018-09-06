require('./config/config');

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

const {mongoose} = require('./db/mongoose');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT;

//middleware
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/', routes);

wss.on('connection', (ws) => {
  ws.send(JSON.stringify('something'));

  ws.on('test', (data) => {
    console.log(data);
    console.log('test');
  });
});

server.listen(port, () => console.log(`Started on port ${port}`));