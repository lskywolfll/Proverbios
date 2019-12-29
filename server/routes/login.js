const express = require('express');
const app = express();
// Paquete de alertas para encriptar las contraseñas
const bcrypt = require('bcrypt');
// Tokens Web Json
const jwt = require('jsonwebtoken');
// Validaciones de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
// Modelo de la tabla en mongodb
const Usuario = require('../models/usuario');

app.post('/Login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    Usuario.findOne({ email: email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // Si no se encuentra ningun usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrrectos'
                }
            });
        }
        // Comparacion de contraseñas con la que encriptada en la base de datos
        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: true,
                message: 'Usuario o contraseña incorrrectos'
            });
        }
        // Se crear el token en base al objeto que nosotros le indiquemos
        let token = jwt.sign({
            usuario: usuarioDB
        },
            process.env.SEED
            , {
                expiresIn: process.env.CADUCIDAD_TOKEN
            });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // Propiedades a retornar con los datos obtenidos a partir del token del usuario
    // Tratando replicar un poco el modelo de nuestro usario para mongodb(schema)
    return {
        nombre: payload.name,
        email: payload.email,
        imageUrl: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    const googleUser = await verify(req.body.idtoken)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err: err
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            returnres.status(500).json({
                ok: false,
                err: err
            });
        }

        if (usuarioDB) {
            // Usuario ya registrado con el email de manera normal y por ello no puede ahora ingresar mediante el uso de google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                },
                    process.env.SEEd,
                    {
                        expiresIn: process.env.CADUCIDAD_TOKEN
                    }
                );

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // Si el usuario es la primera vez que ingresa ala pagian web y quiere registrarse por google
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                },
                    process.env.SEEd,
                    {
                        expiresIn: process.env.CADUCIDAD_TOKEN
                    });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            });
        }
    });
});

module.exports = app;