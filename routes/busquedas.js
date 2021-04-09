/**  
 *  BÚSQUEDAS:

 *  Archivo de rutas para:
        - La búsqueda individual de registrados en la base de datos,
        - La búsqueda por colecciones de registros en la base de datos.

 *  Rutas:
        Padre: '/search/:busqueda'
        Hijas: '/collection/:tabla/:busqueda
*/

// Importaciones
const { Router } = require('express');
const router = Router();

const { existeJWT } = require('../middlewares/existe-jwt');
const { obtenerBusquedaTotal, obtenerDocumentosColeccion } = require('../controllers/busquedas');

// Obtener la búsqueda de un Usuario mediante un ID existente: ------
router.get('/all/:busqueda', existeJWT, obtenerBusquedaTotal)
router.get('/collection/:tabla/:busqueda', existeJWT, obtenerDocumentosColeccion)

// Exportaciones
module.exports = router;