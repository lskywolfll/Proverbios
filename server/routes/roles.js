const express = require('express');
const app = express();
const Roles = require('../models/roles');
const _ = require('underscore');
const { Fecha_Formatear } = require('../Controllers/ControladorDeTiempo');
const { verficarToken, verificarAdmin_Role } = require('../middleware/autenticacion');

app.get('/Roles', [verficarToken, verificarAdmin_Role], (req, res) => {

    Roles.find({})
        .exec((err, rolesDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.status(200).json({
                ok: true,
                roles: rolesDB
            })
        });
});

app.get('/Rol/:id', [verficarToken, verificarAdmin_Role], (req, res) => {

    const id = req.params.id;

    Roles.findById(id, (err, rolDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
    
        if(!rolDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El rol no existe'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            rol: rolDB
        });
    });
});

app.post('/Rol', (req, res) => {

    const body = _.pick(req.body, ['descripcion']);
    const fecha = Fecha_Formatear(new Date());

    const rol = new Roles({
        ...body,
        fecha
    });

    rol.save((err, rolDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!rolDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear el rol'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            rol: rolDB
        });
    });
});

app.put('/Rol/:id', [verficarToken, verificarAdmin_Role], (req, res) => {
    const id = req.params.id;
    const data = _.pick(req.body, ['descripcion']);
    const fecha = Fecha_Formatear(new Date());

    const body = {
        ...data,
        fecha
    }

    Roles.findByIdAndUpdate(id, body,{ new: true, runValidators: true }, (err, rolDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!rolDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear el rol'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            rol: rolDB
        });
    });
});

app.delete('/Rol/:id', [verficarToken, verificarAdmin_Role], (req, res) => {
    const id = req.params.id;

    Roles.findByIdAndRemove(id, (err, rolDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!rolDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El rol no existe'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            rol: rolDB
        });
    })
});

module.exports = app;