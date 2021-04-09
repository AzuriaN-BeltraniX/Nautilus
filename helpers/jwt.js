/**
 *  Axiliar para
 *      - Generar un nuevo TOKEN de inicio de sesión a un usuario.
 */

// Importaciones
const jwt = require('jsonwebtoken');

// Genera un TOKEN con JsonWebToken:
const generarJWT = (data, limit) => {
    // Promesa...
    return new Promise( (resolve, reject) => {
        // Requeire de los siguientes datos para generar un token:
        const payload = {user: data};
        const seed = process.env.JWT_SECRET;
        const expires = limit; // Con caducidad que el desarrollador ingrese en "limit"

        // Cargado el PAYLOAD, genera el Token
        jwt.sign(payload, seed, {expiresIn: expires}, (err, token) => {
            if (err) { // Si hay un error, entonces...
                console.log(err); // Imprime el error
                reject('') // Rechaza la generación del TOKEN con un mensaje de error
            } else { // Si no hay error, entonces... 
                resolve(token) // Muestra el token generado.
            };
        });
    });
};


// Exportaciones
module.exports = {
    generarJWT
}