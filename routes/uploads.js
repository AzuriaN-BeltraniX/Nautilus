/**  
 *  CARGA DE ARCHIVOS:

 *  Archivo de rutas para:
        - Las peticiones CRUD de 'Carga de archivos' en la base de datos.

 *  Rutas:
        Padre: '/api/upload'
        Hijas: '/api/:ID - :IMG'
*/

// Importaciones
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { existeJWT } = require('../middlewares/existe-jwt');

const { fileUpload, muestraImagen } = require('../controllers/uploads');

// Define la variable, siendo igual de la imprtación:
const router = Router();

// Middleware:
router.use(expressFileUpload());

// Sube un archivo: -----------------------------------------
router.put('/:tipo/:id', existeJWT, fileUpload);

// Muestra un archivo: -----------------------------------------
router.get('/:tipo/:img', muestraImagen);

// Exportaciones
module.exports = router;