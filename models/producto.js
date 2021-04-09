/** ESQUEMA PARA EL FUNCIONAMIENTO DEL CRUD DE "PRODUCTOS" e "INVENTARIOS" */

// Importaciones
const { Schema, model } = require('mongoose');

// Esquema de Inventario:
const InventarioSchema = Schema({
    almacen: {
        type: Schema.Types.ObjectId,
        ref: 'Almacen',
        required: true
    },
    cantidad: {
        type: Number,
        default: 0
    }
});

// Esquema de Producto:
const ProductoSchema = Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number
    },
    inventario: [InventarioSchema],
    precio: {
        type: Number,
        required: true
    },
    img: {
        type: String
    },
    usuarioReg: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection : 'productos'});

// Método para el mostrado de las peticiones
ProductoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

// Exportaciones:
module.exports = model('Producto', ProductoSchema);