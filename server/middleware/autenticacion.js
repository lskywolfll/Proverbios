const jwt = require('jsonwebtoken');

/**
 * Verificar Token
 */
const verficarToken = (req, res, next) => {

    // Propiedad del header y el valor que enviamos a la api
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        // Si no es valido con el seed(secreto) nuestro lanzara un error
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        // console.log(decoded.usuario);
        next();
    });
};

/**
 * Verificar si es rol que posee el usuario en su token es administrador
 */
const verificarAdmin_Role = (req, res, next) => {

    const usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = {
    verficarToken,
    verificarAdmin_Role
}