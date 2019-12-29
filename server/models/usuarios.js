const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); 

// Crear schema en mongo para que sea el objeto(Tabla) de la base de datos por su estructura
let Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

// Se crean las propiedades del objeto de la entidad que tenemos en nuestra base de datos de las tabla ala cual estemos haciendo referencia
let usuarioSchema = new Schema({
    // En las propiedades nosotros podemos establecer restricciones en su uso, ya sea tipo de dato y campo obligatorio
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    email: {
        type: String,
        // Al establecer un dato unico que no se puede repetir en la BD de mongo, solo agregamos el unique para que lo valide y tambien tener en cuenta reiniciar el servidor para que pueda tomar los cambios ya que a veces no los toma al tenerlo corriendo con nodemon
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    // role:{
    //     type: String,
    //     default: 'USER_ROLE',
    //     // Enum => Para solamente establecer ciertos valores para aceptar dentro de un array(cajita) y un message(Error) donde nosotros estableceremos como nos devuelve el error con su definicion respectiva.
    //     enum: rolesValidos
    // },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Debe ser un rol valido'],
        ref: 'Roles'
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

// Convierte a un objeto json(Javascript Object Notacion) y lo procesa antes que nos devuelva el dato completo en las apis que estemos usando
// En este ejemplo quitamos la propiedad de la contraseña para cambiarle su valor para que de esta manera sea mas seguro y mas dificil para los atacanques de nuestra app conseguir un acceso direcctort de nuestros usuarios
// Con  esto nosotros los vamos a proteger de esas pequeñas falllas que algunos programadores no tomas en cuenta a la hora de desarrollar para poder constuir algo siempre debemos tener un punto de vista mas a futuro
usuarioSchema.methods.toJSON = function(){
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Agregamos una funcionalidad al esquema donde le agregamos un superpoder, en este punto usarmos la paqueteria de validacion que nos devolver el error completo y mejor estructurado, pero de igual manera se puede agregar otro parametros en el cual lo invoquemos como objeto y pongamos la propiedad de message y dentro de su contenido ponemos el {PATH} PATH en este punto seria el error encontrado por el cual no paso al validacion donde podemos agregar otro contenido despues de enviar el error.
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

// Al crear un modelo de datos debemos indicar primero el nombre clave que tendra y luego poner el schema en el cual se basa
module.exports = mongoose.model('Usuarios', usuarioSchema);