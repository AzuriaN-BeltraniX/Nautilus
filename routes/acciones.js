/**  
 *  Peticiones para realizar acciones dentro de la aplicación NautilusApp:

 *  Archivo de rutas para:
        - Las peticiones de envío de correos electrónicos.
        - Verificar la existencia de códigos.

 *  Rutas:
        Padre: '/api/info'
        Hijas: '/api/info/:action'
*/

// Importaciones:
const { Router } = require('express');
const { resetPwd_Email } = require('../controllers/email');
const { validarCodigo } = require('../controllers/codigos');
const { validarUsuario, validarAdmin_bool } = require('../middlewares/validar-usuario');

// Declaraciones
const router = Router();

// Ruta para enviar el correo de restablecimiento de contraseña:
router.post('/actionsNautilus/emailResetPwd', resetPwd_Email);

// Ruta para validar la existencia de un código para reestablecer una contraseña:
router.post('/actionsNautilus/verifyCode', validarCodigo)

// Ruta para verificar la existencia de un usuario desde el token;
router.get('/actionsNautilus/validUser', validarUsuario)

// Ruta para verificar el rol de usuario
router.get('/actionsNautilus/roles/validAdmin', validarAdmin_bool)

// Exportaciones
module.exports = router;