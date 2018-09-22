require('./config/config');

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

const {mongoose} = require('./db/mongoose');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

//middleware
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/', routes);

server.listen(port, () => console.log(`Started on port ${port}`));