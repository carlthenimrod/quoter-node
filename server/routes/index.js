const routes = require('express').Router();
const quotes = require('./quotes');

routes.use('/quotes', quotes);

module.exports = routes;