//Gestionar la conexcion
const db = require('mongoose');
db.Promise = global.Promise;

async function connect(url) {
    await db.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    console.log('[db] Conectada con éxito');
}

module.exports = connect;