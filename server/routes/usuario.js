const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verficarToken, verificarAdmin_Role } = require('../middleware/autenticacion');

app.get('/Usuario', verficarToken, (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 16;
    const activacion = req.query.activacion || true;

    // desde = Number(desde);
    // hasta = Number(hasta);

    // 1- parametro => podemos crear un filtrado mediante un dato que posea un valor en especifico y solo recibir los datos que tengan ese valor en contreto, ya sea que el usuario este activo o no activo(no este por ej: en la empresa lo despidieron entonces este usuario ya no esta activo, los datos tienen que persistir en el tiempo). 

    // 2-parametros nos sirve para indicar que datos queremos recibir al buscar en la bd de mongo, usamos simplemente un string con las propiedades respectivas a quere los cuales se separan mediante un espacio
    Usuario.find({ estado: activacion }, 'nombre email google role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            // Contar la cantidad de registros
            // el uso del {} como primer parametros si lo mandamos vacio entonces este nos mandara todos los datos completos indepeniente de lo que sea
            // Parametros
            // 1- filtro => {propiedad:valorDeseado} con los cuales solamente nos saldran los datos que entren en el Match de nuestro filtro ya sea nada o un dato especifico
            // 2- callback
            Usuario.countDocuments({ estado: activacion}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        })
});

app.post('/Usuario', [verficarToken, verificarAdmin_Role], (req, res) => {

    const body = req.body;

    const usuario = new Usuario({
        // Formas de recoleccion de datos enviados a la api, Locura completa
        // 1- req.body.propiedad
        // 2- body.propiedad
        nombre: body.nombre,
        email: body.email,
        // Creacion de una contraseña con una seguridad en base a un algoritmo que indicas cuan robusta sera en este ejemplo es de 10 vueltas para hacerlo mas complejo nivel 10
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Al guardar en mongo recibimos 2 parametros un error y el usuario
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

app.delete('/Usuario/:id', [verficarToken, verificarAdmin_Role], (req, res) => {

    const id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if(err || !usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             message: 'Usuario no encontrado',
    //             err: err
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

    // param 2 => indicamos la actualizacion que nosotros queremos hacer ya sea una sola propiedad o el objeto completo o ciertas propiedades que posea y no todos.
    // Persistencia de los datos 

    // const cambioEstado = {
    //     estado: false
    // }

    Usuario.findByIdAndUpdate(id, { estado: false }, (err, usuarioBorrado) => {
        if (err || !usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no encontrado',
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

app.put('/Usuario/:id', [verficarToken, verificarAdmin_Role],(req, res) => {
    // El parametros que se toman mediante la url con los (:variable) se tienen que llamar de la misma manera para que podamos obtener el dato enviado
    let id = req.params.id;
    // Una metodologia para obtener los datos del req.body de manera mas sencilla y rapida sin tener que insertarlo en alguna otra parte para poder usarlas
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // Con el estandar ES6 es redundaten poner id: id, ya que por si solo poniendo id este lo instanciara con el mismo nombre de la variable
});

module.exports = app;