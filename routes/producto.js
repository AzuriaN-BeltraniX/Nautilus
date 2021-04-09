/**  
 *  Productos:

 *  Archivo de rutas para:
        - Las peticiones CRUD de 'Productos' en la base de datos.

 *  Rutas:
        Padre: '/api/productos'
        Hijas: '/api/productos/:id'
               '/api/productos/:almacen'
*/

// Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { obtenerProductos, crearProducto, actualizarProducto, actualizarExistencias, eliminarProducto } = require('../controllers/producto');
const { existeJWT } = require('../middlewares/existe-jwt');
const { validarAdmin } = require('../middlewares/validar-usuario');

// Declaraciones
const router = Router();

// Obtiene los productos -------------------------------------------
router.get('/', obtenerProductos);

// Crea un nuevo producto ------------------------------------------
router.post('/', 
    [
        existeJWT,
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(), // Validación del nombre
        check('descripcion', 'La descripción es obligatoria.').not().isEmpty(), // Validación del nombre
        check('precio', 'El precio es requerido.').not().isNumeric(), // Validación del nombre
        validarAdmin
    ],
    crearProducto
);

// Actualiza un producto -------------------------------------------
router.put('/:id', [existeJWT, validarAdmin], actualizarProducto);

// Actualiza las existencias de un producto en un almacén ---------
router.put('/', [existeJWT, validarAdmin], actualizarExistencias);

// Elimina un producto ---------------------------------------------
router.delete('/:id', [existeJWT, validarAdmin], eliminarProducto);

// Exportaciones
module.exports = router;