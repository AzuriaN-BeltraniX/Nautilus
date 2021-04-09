/** ESQUEMA PARA EL FUNCIONAMIENTO DEL SISTEMA DE "VENTAS" */

// Importaciones
const { Schema, model } = require('mongoose');

// Objeto para validar tipos de pago:
const pagosValidos = {
    values: ['efectivo', 'tarjeta', 'transferencia', 'otro'],
    msg: ''
};

// Esquema de Cantidad de Productos en Carrito:
const prodCantidadSchema = Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    cantidad: {
        type: Number
    }
}, { strict: false });

// Esquema de Venta:
const VentaSchema = Schema({
    clave: {
        type: String,
        unique: true,
        required: true
    },
    productos: [prodCantidadSchema],
    monto: {
        type: String,
        required: true
    },
    pago: {
        type: String,
        required: true,
        enum: pagosValidos
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    }
});

// Método para el mostrado de las peticiones
VentaSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

// Exportaciones:
module.exports = model('Venta', VentaSchema);