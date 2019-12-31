// const express = require('express');

const Usuario = require('./usuario');
const Login = require('./login');
const Proverbio = require('./proverbio');
const Roles = require('./roles');

const routes = (server) => {
    server.use('/', Usuario);
    server.use('/', Login);
    server.use('/', Proverbio);
    server.use('/', Roles);
};

module.exports = routes;