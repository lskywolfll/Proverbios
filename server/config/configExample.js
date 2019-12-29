
// =================================
//  Configuraciones
// =================================
const config = {
    dbUrl: process.env.DB_URL || 'mongodb+srv://user:<password>j@cluster0-b0vhf.mongodb.net/table(or collections name)',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    // publicRoute: process.env.PUBLIC_ROUTE || '/app',
    // filesRoute: process.env.FILES_ROUTE || 'files',
};

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
process.env.CADUCIDAD_TOKEN = '48h';
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

module.exports = config;