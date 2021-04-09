/**
 *  Auxiliar para:
 *      - Eliminar una imagen de la base de datos, y su asociación con el usuario a actualizar,
 *      - Actualizar una imagen asociada a un usuario específico, y eliminar la anterior imagen.
 */

// Importaciones
const fs = require('fs');

const Usuario = require('../models/usuario');
const Doctor = require('../models/doctores');
const Paciente = require('../models/pacientes');
const Almacen = require('../models/almacen')
const Producto = require('../models/producto')

// Borrando imágenes
const borrarImagen = (path) => {
    // ... Si existe el path anterior,, si sí existe una imagen, entonces...
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    } // Bórralo
}

// Asignando a usuario la imagen
const actualizarImagen = async (tipo, id, nomArchivo) => {
    // Declarando la variable "pathViejo", de tipo STRING(void):
    let pathViejo = '';

    // Evaluando el tipo
    switch (tipo) {
        case 'users': 
            // Verifica si el tipo es un Usuario mediante un ID:
            const usuario = await Usuario.findById(id);
            if (!usuario) { // Si el ID no pertenece a un usuario, entonces...
                console.log('No se encontró un usuario por ID'); // Imprime mensaje,
                return false; // Retorna un valor falso
            }

            // Si el usuario ya tiene una imagen asignada, entonces elimina la anterior:
            pathViejo = `./uploads/users/${usuario.img}`; // Captura el archivo...
            borrarImagen(pathViejo); // Borra la imagen.

            // Captura el nombre y actualiza el archivo
            usuario.img = nomArchivo; // Determina la ubicación del nombre del archivo
            await usuario.save(); // Guarda la nueva imagen el Base de Datos
            return true; // Retorna un valor verdadero, que significa exitosa
        break;

        case 'medicos': 
            // Verifica si el tipo es un Usuario mediante un ID:
            const doctor = await Doctor.findById(id);
            if (!doctor) { // Si el ID no pertenece a un usuario, entonces...
                console.log('No se encontró un doctor por ID'); // Imprime mensaje,
                return false; // Retorna un valor falso
            }

            // Si el usuario ya tiene una imagen asignada, entonces elimina la anterior:
            pathViejo = `./uploads/medicos/${doctor.img}`; // Captura el archivo...
            borrarImagen(pathViejo); // Borra la imagen.

            // Captura el nombre y actualiza el archivo
            doctor.img = nomArchivo; // Determina la ubicación del nombre del archivo
            await doctor.save(); // Guarda la nueva imagen el Base de Datos
            return true; // Retorna un valor verdadero, que significa exitosa
        break;

        case 'pacientes': 
        // Verifica si el tipo es un Usuario mediante un ID:
        const paciente = await Paciente.findById(id);
        if (!paciente) { // Si el ID no pertenece a un usuario, entonces...
            console.log('No se encontró un paciente por ID'); // Imprime mensaje,
            return false; // Retorna un valor falso
        }

        // Si el usuario ya tiene una imagen asignada, entonces elimina la anterior:
        pathViejo = `./uploads/pacientes/${paciente.img}`; // Captura el archivo...
        borrarImagen(pathViejo); // Borra la imagen.

        // Captura el nombre y actualiza el archivo
        paciente.img = nomArchivo; // Determina la ubicación del nombre del archivo
        await paciente.save(); // Guarda la nueva imagen el Base de Datos
        return true; // Retorna un valor verdadero, que significa exitosa
        break;

        case 'almacenes': 
        // Verifica si el tipo es un Usuario mediante un ID:
        const almacen = await Almacen.findById(id);
        if (!almacen) { // Si el ID no pertenece a un usuario, entonces...
            console.log('No se encontró un almacen por ID'); // Imprime mensaje,
            return false; // Retorna un valor falso
        }

        // Si el usuario ya tiene una imagen asignada, entonces elimina la anterior:
        pathViejo = `./uploads/almacenes/${almacen.img}`; // Captura el archivo...
        borrarImagen(pathViejo); // Borra la imagen.

        // Captura el nombre y actualiza el archivo
        almacen.img = nomArchivo; // Determina la ubicación del nombre del archivo
        await almacen.save(); // Guarda la nueva imagen el Base de Datos
        return true; // Retorna un valor verdadero, que significa exitosa
        break;

        case 'productos': 
        // Verifica si el tipo es un Usuario mediante un ID:
        const producto = await Producto.findById(id);
        if (!producto) { // Si el ID no pertenece a un usuario, entonces...
            console.log('No se encontró un producto por ID'); // Imprime mensaje,
            return false; // Retorna un valor falso
        }

        // Si el usuario ya tiene una imagen asignada, entonces elimina la anterior:
        pathViejo = `./uploads/productos/${producto.img}`; // Captura el archivo...
        borrarImagen(pathViejo); // Borra la imagen.

        // Captura el nombre y actualiza el archivo
        producto.img = nomArchivo; // Determina la ubicación del nombre del archivo
        await producto.save(); // Guarda la nueva imagen el Base de Datos
        return true; // Retorna un valor verdadero, que significa exitosa
        break;
    }

    /* Prueba de data
    console.log('actualizarImagen is working!!!');
    */
}

// Exportaciones
module.exports = {
    actualizarImagen
}