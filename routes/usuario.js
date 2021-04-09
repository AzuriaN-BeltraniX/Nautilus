/**  
 *  Usuarios:

 *  Archivo de rutas para:
        - Las peticiones CRUD de 'Usuarios' en la base de datos.

 *  Rutas:
        Padre: '/api/users'
        Hijas: '/api/users/:ID'
*/

// Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { obtenerUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuarios, actualizarPwd_Usuario } = require('../controllers/usuario');
const { existeJWT } = require('../middlewares/existe-jwt');
const { validarAdmin, validarAdmin_Usuario } = require('../middlewares/validar-usuario');
 
// Declaraciones
const router = Router();

/** RUTAS:
 *      Padre: /users
 *      Hijas:
 *          · /getData
 *          · /:id
*/

// Obtiene los usuarios -------------------------------------------
router.get('/', existeJWT, validarAdmin_Usuario, obtenerUsuarios);

// Crea los usuarios ----------------------------------------------
router.post('/',
    [ // Validación del esquema ('UsuarioSchema'):
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Validación del nombre
        check('password', 'El password es obligatorio').not().isEmpty(), // Validación de la contraseña
        check('email', 'El email es obligatorio').isEmail(), // Validación del correo electrónico
        validarCampos
    ],
    crearUsuarios
);

// Actualiza los usuarios -----------------------------------------
router.put('/:id',
    [ // Validación del esquema ('UsuarioSchema'):
        existeJWT, 
        validarAdmin_Usuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Validación del nombre
        check('email', 'El email es obligatorio').isEmail(), // Validación del correo electrónico
        check('role', 'El rol de usuario es obligatorio').not().isEmpty(), // Validación del rol del usuario
        validarCampos
    ],
    actualizarUsuarios
);

// Actualiza un usuario -------------------------------------------
router.put('/update/:id',
    [
        existeJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Validación del nombre
        check('email', 'El email es obligatorio').isEmail(), // Validación del correo electrónico
        validarCampos
    ], 
    actualizarUsuarios
);

// Actualiza la contraseña de un usuario por Código ---------------
router.post('/resetPwd-code', actualizarPwd_Usuario);

// Actualiza la contraseña de un usuario por URL ------------------
router.post('/resetPwd-url', actualizarPwd_Usuario);

// Borra los usuarios ---------------------------------------------
router.delete('/:id',
    [existeJWT, validarAdmin],
    borrarUsuarios
);

// Exportaciones
module.exports = router;