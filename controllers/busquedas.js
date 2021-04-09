/**
 *  Controlador de:
 *      - Busquedas mediante un ID de algún usuario existente,
 *      - Búsquedas mediante colecciones existentes
*/ 

// Importaciones
const { response } = require('express');

const Usuario = require('../models/usuario');
const Doctor = require('../models/doctores');
const Paciente = require('../models/pacientes');

// Controlador para realizar una búsqueda por ID de usuario existente: 
const obtenerBusquedaTotal = async (req, res = response) => {
    // Realizando la búsqueda:
    const busqueda = req.params.busqueda; // Requiere el parámetro de búsqueda
    const regex = new RegExp(busqueda, 'i'); // Declarando expresión regular de búsqueda insensible.

    // Promesa...
    const [ usuarios, doctores, pacientes ] = await Promise.all([
        Usuario.find({nombre: regex}), // Búsqueda de usuarios
        Doctor.find({nombre: regex}), // Búsqueda de doctores
        Paciente.find({nombre: regex}) // Búsqueda de pacientes
    ]);

    // Prueba de data:
    res.json({
        ok: true, // Búsqueda exitosa!!!
        // Muestra el resutlado de la busqueda:
        usuarios,
        doctores,
        pacientes
    });
}

// Controlador para realizar una búsqueda mediante colecciones existentes: 
const obtenerDocumentosColeccion = async (req, res = response) => {
    // Realizando la búsqueda:
    const tabla = req.params.tabla; // Requiere el parámetro de la colección
    const busqueda = req.params.busqueda; // Resquiere el parámetro de búsqueda
    const regex = new RegExp(busqueda, 'i'); // Declarando expresión regular de búsqueda insensible.
    
    const termino = tabla; // Captura el término ingresado 
    let data = []; // Define la variable 'data' como un arreglo

    // Determina las URL válidas
    const validURL = {
        usuarios: '/api/search/collection/users',
        doctores: '/api/search/collection/doctores',
        pacientes: '/api/search/collection/pacientes'
    }

    // Criterio de búsquedas
    switch (tabla) {
        // Búsqueda de usuarios
        case 'users':
            data = await Usuario.find({nombre: regex});
        break;
        // Búsqueda de medicos
        case 'doctores':
            data = await Doctor.find({nombre: regex});
        break;
        // Búsqueda de pacientes
        case 'pacientes':
            data = await Paciente.find({nombre: regex});
        break;
        default: // Si no exite la declaración de los casos anteriores, entonces...
            return res.status(406).json({ // Retorna el estado de petición
                ok: false, // Busqueda fallida... 
                msg: `El término "${termino}" no existe o no es válida, las URL correctas son: ${validURL.usuarios}, ${validURL.doctores}, ${validURL.pacientes}`
            }); // Imprime el mensaje de error
    }

    // Respuesta de la petición:
    res.json({
        ok: true, // Búsqueda exitosa!!!

        resultados: data // Imprime información buscada
    });
}

// Exportaciones
module.exports = {
    obtenerBusquedaTotal,
    obtenerDocumentosColeccion
}