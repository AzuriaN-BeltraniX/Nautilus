// Importaciones
const express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
var path = require('path');

const { dbConnection } = require('./database/config');
require('events').EventEmitter.defaultMaxListeners = 15;

// Crear el servidor express.
const app = express();

// Configuración del CORS
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Methods');
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Lectura y Parseo del BODY
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Conexión a la Base de Datos.
// dbConnection('localHost');
dbConnection('onlineHost');

// Rutas
app.use('/', express.static('public', { redirect: false }));

app.use('/api/users', require('./routes/usuario')); // Usuarios
app.use('/api/login', require('./routes/auth')); // Inicio de Sesión
app.use('/api/search', require('./routes/busquedas')); // Búsqueda global
app.use('/api/search/collection', require('./routes/busquedas')); // Búsqueda por colección
app.use('/api/upload', require('./routes/uploads')); // Archivos

app.use('/api/doctores', require('./routes/doctores')); // Doctores
app.use('/api/pacientes', require('./routes/pacientes')); // Pacientes

app.use('/api/almacenes', require('./routes/almacen')); // Almacenes
app.use('/api/productos', require('./routes/producto')); // Productos
// app.use('/api/ventas') // Ventas
// app.use('/api/pos') // Punto de Venta

app.use('/api/info', require('./routes/acciones')); // Ejecutar acciones en NautilusApi

/** ToDo: MODIFICAR ESTA RUTA */
// Cualquier ruta diferente se direcciona a index del frontend(home)
app.get('*', function(req, res, next) {
    res.sendFile(path.resolve('public/index.html'));
});

// Esuchando el puerto 3000.
const port = process.env.PORT; // Define el puerto...

app.listen(port, () => {
    console.log(`\x1b[35m[ App Port ] \x1b[0m\x1b[2m=== \x1b[0m\x1b[1m${port} \x1b[0m`);
}); // Escucha el puerto definido



// ------------------------------- Credenciales MongoDB ---
// user: AzBel_admin
// password: e4Pc4rXetVSACZVf
// --------------------------------------------------------