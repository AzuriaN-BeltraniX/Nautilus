/**  
 *  Almacenes:

 *  Archivo de rutas para:
        - Las peticiones CRUD de 'Almacenes' en la base de datos.

 *  Rutas:
        Padre: '/api/almacenes'
        Hijas: '/api/almacenes/update/:id'
*/

// Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { crearAlmacen, obtenerAlmacenes, actualizarAlmacen, eliminarAlmacen } = require('../controllers/almacen');
const { existeJWT } = require('../middlewares/existe-jwt');
const { validarAdmin } = require('../middlewares/validar-usuario');

// Declaraciones
const router = Router();

// Obtiene los almacenes -------------------------------------------
router.get('/', existeJWT, obtenerAlmacenes);

// Crea un nuevo almacén -------------------------------------------
router.post('/',
    [ // Validación del esquema ('AlmacenSchema'):
        existeJWT,
        validarAdmin,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Validación del nombre
        validarCampos
    ],
    crearAlmacen
);

// Actualiza un almacén --------------------------------------------
router.put('/update/:id',
    [ // Validación del esquema ('AlmacenSchema'):
        existeJWT,
        validarAdmin,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Validación del nombre
        validarCampos
    ],
    actualizarAlmacen
);

// Elimina un almacén ----------------------------------------------
router.delete('/:id', [existeJWT, validarAdmin], eliminarAlmacen);

// Exportaciones
module.exports = router;