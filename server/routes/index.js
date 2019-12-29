const express = require('express');

const Usuario = require('./usuario');
const Login = require('./login');

const routes = (server) => {
    server.use('/', Usuario);
    server.use('/', Login);
    server.use('/', Producto);
    server.use('/', Categoria);
};

module.exports = routes;