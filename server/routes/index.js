// const express = require('express');

const Usuario = require('./usuario');
const Login = require('./login');
const Proverbio = require('./proverbio');

const routes = (server) => {
    server.use('/', Usuario);
    server.use('/', Login);
    server.use('/', Proverbio);
};

module.exports = routes;