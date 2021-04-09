/**  
 *  DOCTORES:

 *  Archivo de rutas para:
        - Las peticiones CRUD de 'Doctores' en la base de datos.

 *  Rutas:
        Padre: '/api/doctores'
*/

// Importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existeJWT } = require('../middlewares/existe-jwt');
const { validarAdmin } = require('../middlewares/validar-usuario');

const { obtenerDoctores, crearDoctor, actualizarDoctor, borrarDoctor } = require('../controllers/doctores');

// Declaraciones
const router = Router();

// Obtiene los doctores ---------------------------------------------
router.get('/',
    existeJWT, // Valida la existencia del token
    obtenerDoctores 
);

// Crea un doctor ---------------------------------------------------
router.post('/',
    [
        existeJWT, // Valida la existencia del token
        validarAdmin, // Valida el rol de administración del usuario logueado
        check('nombre', 'El nombre del doctor es necesario.').not().isEmpty(), // Verifica existencia del nombre.
        check('cedulaProf', 'La cédula profesional es obligatoria.').not().isEmpty(), // Verifica existencia del nombre.
        validarCampos // Valida los datos enviados
    ],
    crearDoctor
);

// Actualiza un doctor mediante ID ---------------------------------
router.put('/:id',
    [
        existeJWT, // Valida la existencia del token
        validarAdmin, // Valida el rol de administración del usuario logueado
        check('nombre', 'El nombre del hospital es necesario').not().isEmpty(), // Verifica existencia del nombre.
        validarCampos // Valida los datos enviados
    ],
    actualizarDoctor
);

// Borra un doctor mediante ID -------------------------------------
router.delete('/:id',
    existeJWT, // Valida la existencia del token
    validarAdmin, // Valida el rol de administración del usuario logueado
    borrarDoctor
);

// Exportaciones
module.exports = router;