/** ESQUEMA PARA EL ALMACENAMIENTO DE CÓDIGOS PARA ACCIONES DENTRO DE LA APLICACIÓN */

// Importaciones:
const { Schema, model } = require('mongoose');

// Esquema de códigos:
const CodeSchema = Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    }
}, {collection: 'codigos'}); // Define el nombre de la conexión);

// Exportaciones:
module.exports = model('Codigo', CodeSchema);