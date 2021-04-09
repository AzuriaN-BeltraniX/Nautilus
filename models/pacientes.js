/** ESQUEMA PARA EL FUNCIONAMIENTO DEL CRUD DE "PACIENTES" */

// Importaciones
const { Schema, model } = require('mongoose');

// Esquema de Doctor
const PacienteSchema = Schema({
    nombre: { // Nombre (obligatorio)
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    img: { // Imagen del doctor (opcional)
        type: String
    },
    doctor: { // Doctor asignado
        required: true,
        type: Schema.Types.ObjectId, // Requiere de la ID del doctor a asociar
        ref: 'Doctor'
    },
    usuario: { // Requiere de un usuario para ser creado
        required: true,
        type: Schema.Types.ObjectId, // Requiere de la ID del usuario para crear
        ref: 'Usuario'
    },
}, {collection: 'pacientes'}); // Define el nombre de la conexión

// Método para el mostrado de las peticiones
PacienteSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

// Exportaciones
module.exports = model('Paciente', PacienteSchema);