/**  
 *  PACIENTES:

 *  Archivo de rutas para:
        - Las peticiones CRUD de 'Pacientes' en la base de datos.

 *  Rutas:
        Padre: '/api/pacientes'
*/

// Importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existeJWT } = require('../middlewares/existe-jwt');
const { validarAdmin } = require('../middlewares/validar-usuario');

const { obtenerPacientes, crearPaciente, actualizarPaciente, borrarPaciente } = require('../controllers/pacientes');

// Declaraciones
const router = Router();

// Obtiene los pacientes --------------------------------------------
router.get('/',
    existeJWT, // Valida la existencia del token
    obtenerPacientes
);

// Crea un paciente -------------------------------------------------
router.post('/',
    [
        existeJWT, // Valida la existencia del token
        validarAdmin, // Valida el rol de administración del usuario logueado
        check('nombre', 'El nombre del paciente es necesario.').not().isEmpty(), // Verifica existencia del nombre.
        check('edad', 'La edad del paciente es necesario.').not().isEmpty(), // Verifica existencia de la edad.
        check('email', 'El email del paciente es requerido.').isEmail(), // Verifica existencia del email..
        check('doctor', 'Requiere de un médico asociado').not().isEmpty(), // Verifica un médico asociado.
        validarCampos // Valida los datos enviados
    ],
    crearPaciente
);

// Actualiza un paciente mediante ID --------------------------------
router.put('/:id',
    [
        existeJWT, // Valida la existencia del token
        validarAdmin, // Valida el rol de administración del usuario logueado
        check('nombre', 'El nombre del paciente es requerido.').not().isEmpty(), // Verifica existencia del nombre.
        check('edad', 'La edad del paciente es requerido.').not().isEmpty(), // Verifica existencia del nombre.
        validarCampos // Valida los datos enviados
    ],
    actualizarPaciente
);

// Borra un paciente mediante ID -------------------------------------
router.delete('/:id',
    existeJWT, // Valida la existencia del token
    validarAdmin, // Valida el rol de administración del usuario logueado
    borrarPaciente
);

// Exportaciones
module.exports = router;