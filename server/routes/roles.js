const express = require('express');
const app = express();
const Roles = require('../models/roles');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verficarToken, verificarAdmin_Role } = require('../middleware/autenticacion');

app.get('/Roles',verficarToken, (req, res) => {

});

app.get('/Rol/:id',verficarToken, (req, res) => {

});

app.post('/Rol',verficarToken, (req, res) => {

});

app.put('/Rol/:id',verficarToken, (req, res) => {

});

app.delete('/Rol/:id',verficarToken, (req, res) => {

});

module.exports = app;