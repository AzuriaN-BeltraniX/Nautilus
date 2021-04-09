/** ESQUEMA PARA EL FUNCIONAMIENTO DEL CRUD DE "DOCTORES" */

// Importaciones
const { Schema, model } = require('mongoose');

// Esquema de Doctor
const DoctorSchema = Schema({
    nombre: { // Nombre (obligatorio)
        type: String,
        required: true
    },
    img: { // Imagen del doctor (opcional)
        type: String
    },
    cedulaProf: { // Cédula profecional del doctor (opcional)
        type: Number,
        required: true
    },
    usuario: { // Requiere de un usuario para ser creado
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {collection: 'doctores'}); // Define el nombre de la conexión

// Método para el mostrado de las peticiones
DoctorSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

// Exportaciones
module.exports = model('Doctor', DoctorSchema);