/**
 *  Asistente para:
 *      - Validar si existe el usuario dentro del token proporcionado,
 *      - Validar el rol de administrador,
 *      - Validar el rol de usuario para mostrar o ejecutar algunas acciones.
*/

// Importaciones:
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Función para validar el usuario dentro de un token proporcionado;
const validarUsuario = (req = request, res = response) => {
    const token = req.header('x-token');
    // ... Verifica el token:
    return new Promise ((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            /** PRUEBA: Imprime en consola los datos decodificados. */
            // console.log(decoded);

            // ... Verifica el 'decoded':
            if (decoded === undefined) {
                reject(
                    res.status(404).json({
                        ok: false
                    })
                );
            } else {
                // ... Busca el usuario en la base de datos,
                const userDB = Usuario.findOne(decoded.user);
    
                // ... Si no existe el usuario en la base de datos, entonces retorna una respuesta de rechazo:
                if(!userDB) {
                    reject(
                        res.status(404).json({
                            ok: false,
                            msg: 'El token no es válido, inicia sesión de nuevo.',
                            error: err
                        })
                    );
                } else {
                    return resolve(
                        res.status(200).json({
                            ok: true,
                            user: decoded.user
                        })
                    );
                };
            };
        });
    });
};

// Validar el Rol de Administrador de un usuario retornando un valor booleano:
const validarAdmin_bool = (req = request, res = response) => {
    // Recupera el token del header:
    const token = req.header('x-token');

    // Extrae el rol de usuario desde los datos del token:
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        const role = decoded.user.role;

        // Verifica si el usuario es Administrador:
        if (role === 'ADMIN_ROLE') {
            return res.status(202).json({
                ok: true,
                authorized: true,
                header: 'Tienes permisos de administrador.'
            })
        } else {
            return res.status(401).json({
                ok: false,
                authorized: false,
                header: '¡Vaya!',
                msg: 'No tienes permitido hacer esta acción, habla con el administrador para aclarar esta situación.'
            });
        };
    });
};

// Validando el Rol de Usuario
const validarAdmin = (req = request, res = response, next) => {
    // Recupera el token del header:
    const token = req.header('x-token');

    // Extrae el rol de usuario desde los datos del token:
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        const role = decoded.user.role;

        // Verifica si el usuario es Administrador:
        if (role === 'ADMIN_ROLE') {
            next();
        } else {
            return res.status(401).json({
                ok: false,
                header: '¡Vaya!',
                msg: 'No tienes permitido hacer esta acción, habla con el administrador para aclarar esta situación.'
            });
        };
    });
}

// Validando el Rol de Usuario y el ID del Usuario
const validarAdmin_Usuario = (req = request, res = response, next) => {
    // Requiere del token para realizar la acción:
    const token = req.header('x-token');
    const id_UserLogged = req.params.id;

    // Extrae los datos del usuario y realiza las siguientes validaciones:
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // Requiere de los siguientes parámetros:
        const userID = decoded.user.userID; // Rescata ID del usuario logueado
        const role = decoded.user.role; // Rescata el rol del usuario logueado

        // Busca los datos del usuario mediante el ID extraído para validar sus datos:
        const usuarioDB = Usuario.findById(userID);
        // ... Si no existe el usuario entonces retorna un mensaje indicando falla en la búsqueda:
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false, // Búsqueda fallida...
                header: 'Vaya...',
                msg: 'El usuario que ingresaste no existe, habla con el administrador sobre este inconveniente.'
            }); // ... retorna el mensaje de error
        };

        // Valida al usuario... 
        /* ... Si su rol declara que es un administrador, ó si es el usuario mismo usuario que
        intenta actualizar su información, entonces... */
        if(role === 'ADMIN_ROLE' || userID === id_UserLogged) {
            next(); // ... Permite ejecutar la acción
        } else { // ... si ninguna de las condiciones anteriores se cumple, entonces... 
            return res.status(403).json({
                ok: false,
                header: '¡Te aptrape!',
                msg: 'No tienes permitido hacer esta acción, habla con el administrador para aclarar esta situación.'
            }); // ... retorna el mensaje de error.
        };
    });
};

// Exportaciones:
module.exports = {
    validarUsuario,
    validarAdmin,
    validarAdmin_bool,
    validarAdmin_Usuario
};