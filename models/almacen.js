/** ESQUEMA PARA EL FUNCIONAMIENTO DEL CRUD DE "ALMACEN" */

// Importaciones:
const { Schema, model } = require('mongoose');

// Esquema de Almacen:
const AlmacenShema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection: 'almacenes'});

// Método para el mostrado de las peticiones
AlmacenShema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

// Exportaciones:
module.exports = model('Almacen', AlmacenShema);
