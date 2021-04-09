/**
 *  Asistente para:
 *      - Validar si el usuario completó todos los campos en un formulario.
 */

// Importaciones
const { response } = require('express');
const { validationResult } = require('express-validator');

// Validación de los campos del modelo de Usuarios.
const validarCampos = (req, res = response, next) => {
    // Errores? ...
    const errores = validationResult(req); // Valida si hay un error en la solicitud:
    if (!errores.isEmpty()) { // Si no esta vacío, entonces...
        return res.status(400).json({
            ok: false,
            msg: 'Asegúrate de haber completado todos los campos.',
            errors: errores.mapped()
        }); // Retorna mensaje de error.
    }

    next();
}

// Exportaciones
module.exports = {
    validarCampos
}