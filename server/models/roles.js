const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Crear schema en mongo para que sea el objeto(Tabla) de la base de datos por su estructura
let Schema = mongoose.Schema;

// Se crean las propiedades del objeto de la entidad que tenemos en nuestra base de datos de las tabla ala cual estemos haciendo referencia
let rolesSchema = new Schema({
    // En las propiedades nosotros podemos establecer restricciones en su uso, ya sea tipo de dato y campo obligatorio
    descripcion: {
        type: String,
        required: [true, 'La descripcion es necesaria']
    },
    fecha: {
        type: String,
        required: [true, 'La fecha es necesaria']
    }
});

// Agregamos una funcionalidad al esquema donde le agregamos un superpoder, en este punto usarmos la paqueteria de validacion que nos devolver el error completo y mejor estructurado, pero de igual manera se puede agregar otro parametros en el cual lo invoquemos como objeto y pongamos la propiedad de message y dentro de su contenido ponemos el {PATH} PATH en este punto seria el error encontrado por el cual no paso al validacion donde podemos agregar otro contenido despues de enviar el error.
rolesSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

// Al crear un modelo de datos debemos indicar primero el nombre clave que tendra y luego poner el schema en el cual se basa
module.exports = mongoose.model('Roles', rolesSchema);