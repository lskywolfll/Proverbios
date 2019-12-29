const express = require('express');
// const mongoose = require('mongoose');
const db = require('./config/db');
// Rutas para cualquier sistema operativo
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors')
const Router = require('./routes/index');

// Configuraciones del server
const config = require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta publica
// resolve => soluciona el tema para que la ruta sea valida independiente de los argumentos que tengas
app.use(express.static(path.resolve(__dirname , '../public')));

// app.use(cors);

// Routes

Router(app);

// Serializar el contenido a json con bodyparser
// Este extraer una porcion del cuepor de los datos que se envian por el req.body
// Pasear a: buffer, textos y urls decodificando los datos enviados mediante una peticion post
// urlencoded true => recibir cualquier cosa y false recibir solo json,urlparams,objectos ningun otro tipo mas
// Example

// // create application/json parser
// var jsonParser = bodyParser.json()

// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, function (req, res) {
//   res.send('welcome, ' + req.body.username)
// })

// // POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, function (req, res) {
//   // create user in req.body
// });

// end Example

// app.get('/', (req, res) => {
//     res.send('Hola');
// });

// mongoose.connect('mongodb://localhost:27017/cafe', {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// },
//     (err, res) => {
//         if (err) throw err;

//         console.log('Base de datos corriendo localmente y conectada');
//     }
// );

// Conexion a la base de datos de mongo db
db(config.dbUrl);

app.listen(config.port, () => {
    console.log(`Se ha iniciado el servidor en: ${config.host}:${config.port}`);
});