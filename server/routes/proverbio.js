const express = require('express');
const app = express();
const Proverbio = require('../models/proverbio');
const _ = require('underscore');
const { Fecha_Formatear } = require('../Controllers/ControladorDeTiempo');
const { verficarToken, verificarAdmin_Role } = require('../middleware/autenticacion');

app.get('/Proverbios', verficarToken,(req, res) => {
    // Para temas de carga por ser muchos proverbios y tenerlos controlados
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 16;
    // const activacion = req.query.activacion || true;

    Proverbio.find({  })
        .skip(desde)
        .limit(limite)
        .populate('Usuarios')
        .exec((err, proverbioDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                proverbios: proverbioDB
            });
        });
});

app.get('/Proverbio/:id',verficarToken, (req, res) => {
    const id = req.params.id;

    Proverbio.findById(id, (err, proverbioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!proverbioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El proverbio con el id ingresado no existe'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            proverbio: proverbioDB
        });
    });
});

app.post('/Proverbio',verficarToken, (req, res) => {
    const body = _.pick(req.body, ['autor', 'contenido']);
    const fecha = Fecha_Formatear(new Date());

    const proverbio = new Proverbio({
        ...body,
        fecha,
        usuario: req.usuario._id
    });

    proverbio.save((err, proverbioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!proverbioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear el proverbio'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            proverbio: proverbioDB
        });
    });
});

app.put('/Proverbio/:id',verficarToken, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['contenido', 'autor']);

    Proverbio.findByIdAndUpdate(id, body,{ new: true, runValidators: true }, (err, proverbioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!proverbioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo actualizar el proverbio'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            proverbio: proverbioDB
        });
    });
});

app.delete('/Proverbio/:id',verficarToken, (req, res) => {
    const id = req.params.id;

    Proverbio.findByIdAndDelete(id, (err, proverbioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!proverbioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El proverbio con el id ingresado no existe'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            proverbio: proverbioDB
        });
    });
});

module.exports = app;