const routes = require('express').Router();
const quotes = require('./quotes');
const comments = require('./comments');

routes.use('/quotes', quotes);
routes.use('/comments', comments);

module.exports = routes;