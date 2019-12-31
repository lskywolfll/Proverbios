// const express = require('express');

const Usuario = require('./usuario');
const Login = require('./login');

const routes = (server) => {
    server.use('/', Usuario);
    server.use('/', Login);
};

module.exports = routes;