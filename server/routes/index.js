const routes = require('express').Router();
const users = require('./users');
const quotes = require('./quotes');

routes.use('/users', users);
routes.use('/quotes', quotes);

module.exports = routes;