/** ESQUEMA PARA EL FUNCIONAMIENTO DEL CRUD DE "USUARIOS" */

// Importaciones
const { Schema, model } = require('mongoose');

// Esquema de Usuario
const UsuarioSchema = Schema({
    nombre: { // Nombre (obligatorio)
        type: String,
        required: true
    },
    email: { // Correo electónico (obligatorio, único)
        type: String,
        required: true,
        unique: true
    },
    password: { // Contraseña, mínimo 8 carácteres (obligatorio)
        type: String,
        required: true
    },
    img: { // Imagen del perfil de Usuario (opcional)
        type: String
    },
    tmpCode: { // Códigos de acción del Usuario (opcional)
        type: Number
    },
    role: { // Determina rol de usuario, por defecto: USER_ROLE
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: { // Autenticacion por Google (opcional, por defecto FALSE)
        type: Boolean,
        default: false
    }
});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, tmpCode, ...object } = this.toObject();
    object.userID = _id;

    return object;
})

// Exportaciones
module.exports = model('Usuario', UsuarioSchema);