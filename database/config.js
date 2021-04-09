// Importaciones
const mongoose = require('mongoose');

// Datos del DB
const APPNAME = 'nautilusApi';
const DBNAME = 'nautilusData';

// Promesa de conexión a MongoDB
const dbConnection = async (host) => {
    const onlineHost = `mongodb+srv://AzBel_admin:e4Pc4rXetVSACZVf@cluster0.ha0bs.mongodb.net/${DBNAME}`;
    const localHost = `mongodb://localhost:27017/${DBNAME}`;

    if (host === 'localHost') {
        const DBUSER = 'admin_nautilusApi';
        const DBPSSWD = '1104003729_azbel';

        await mongoose.connection.openUri(
            (`${localHost}`), 
            // { useNewUrlParser: true, useUnifiedTopology: true, user: `${DBUSER}`, pass: `${DBPSSWD}` }, (err) => {
            { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
                // Si hay error, muestra error en consola
                if (err) throw err;
        
                // Mensaje de conexión exitosa!!
                console.log(`\x1b[35m[ DB Online ] \x1b[0m\x1b[2m==\x1b[0m \x1b[1m${APPNAME} \x1b[2m\x1b[3m(online localhost) \x1b[0m`);
            }
        );
    } else if (host === 'onlineHost') {
        await mongoose.connect(
            (`${onlineHost}`), 
            { useNewUrlParser: true, useUnifiedTopology: true, }, (err) => {
                // Si hay error, muestra error en consola
                if (err) throw err;
        
                // Mensaje de conexión exitosa!!
                console.log(`\x1b[35m[ DB Online ] \x1b[0m\x1b[2m==\x1b[0m \x1b[1m${APPNAME} \x1b[2m\x1b[3m(online cluster) \x1b[0m`);
            }
        );
    };
};

// EnsureIndex Solution
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Modulos exportados
module.exports = {
    dbConnection
}