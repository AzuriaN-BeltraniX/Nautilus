/**
 *  Controlador de peticiones para:
 *      - (GET) Listar a los pacientes registrados,
 *      - (POST) Registrar un nuevo paciente,
 *      - (PUT) Actualizar un paciente registrado,
 *      - (DELETE) Eliminar un paciente registrado
*/

// Importaciones
const { response } = require('express');

const Paciente = require('../models/pacientes');
const Doctor = require('../models/doctores'); 
const { getUserData } = require('../middlewares/existe-jwt');


// Controlador para listar a los pacientes registrados
const obtenerPacientes = async (req, res = response) => {
    // Obteniendo los pacientes:
    // const pacientes = await Paciente.find() // Busca los pacientes
    //     .populate('usuario', 'nombre role') // Muestra todos los datos del usuario que hizo el registro.
    //     .populate('doctor', 'nombre cedulaProf') // Muestra todos los datos del doctor asignado.

    // Filtrando número de usuarios mostrados:
    const desde = Number(req.query.desde) || 0; // Obtiene el parámetro y lo transforma a número, si no exite, por defecto es 0
    /** PRUEBA: Imprime en consola el número de página solicitado. */ 
    // console.log(desde);
    // console.log(req.query);

    // Promesa...
    const [pacientes, total] = await Promise.all([ // Muestra el resultado de las siguientes promesas:
        // Lista los usuarios existentes en la base de datos:
        Paciente
            .find() // También filtra parámetros
            .skip(desde) // Muestra desde el número de usuario registrado
            .limit(10) // Limita a 5 resultados
            .populate('doctor', 'nombre cedulaProf') // Muestra todos los datos del doctor asignado.
            .populate('usuario', 'nombre'), // Muestra todos los datos del usuario que hizo el registro.

        
        // Conteo de usuarios registrados
        Paciente.countDocuments()
    ]);

    // Imprimiendo al respuesta de la petición
    res.json({
        ok: true, // Listado exitoso
        total, // Indica el número total de registros
        pacientes // Lista de pacientes registrados
    });
};

// Controlador para registrar un nuevo paciente
const crearPaciente = async (req, res = response) => {
    // Requiere de los datos de usuario para proceder:
    const token = req.header('x-token');
    const userData = await getUserData(token);

    // Extrae los datos de usuario y crea un nuevo doctor:
    const id_userLogged = userData.userID
    // ... una vez extraído el id de usuario, entonces:
    const paciente = new Paciente({
        usuario: id_userLogged, // Captura el id del usuario que creo al paciente
        ...req.body
    }); // Requiere el usuario logueado para registrar un doctor y los datos ingresados en el BODY

    // Captura los datos del BODY:
    const { 
        email, // Captura la email del paciente
        doctor // Captura la ID del doctor a asociar
    } = req.body;

    // Promesa...
    try {
        // Verifica si el email es único en el registro:
        const existeEmail = await Paciente.findOne({email}); // Busca el email en la base de datos
        if (existeEmail) { // Si existe el email en la base de datos, entonces...
            return res.status(400).json({ // ... retorna estado de la petición
                ok: false,
                header: '¡Hey!',
                msg: 'Este paciente ya esta registrado.'
            }); // ... y mensaje de error.
        };

        // Verifica la existencia del doctor en el registro:
        const noExisteDoctor = await Doctor.findOne({doctor}); // Busca al doctor solicitado en la base de datos
        if (noExisteDoctor) { // Si no existe un doctor con el ID proporcionado, entonces...
            return res.status(400).json({ // ... retorna estado de la petición
                ok: false,
                header: 'Vaya...',
                msg: 'No existe un doctor con el ID que haz proporcionado.'
            }); // ... y mensaje de error
        }

        // Si hay datos, entonces registra al nuevo paciente:
        const pacienteDB = await paciente.save();

        // Imprime el resultado de la petición
        res.json({
            ok: true, // Registro exitoso!!!
            paciente: pacienteDB // Nombre del paciente registrado
        });
    } catch (error) { // Si no se puede registrar al paciente, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Muestra el mensaje de error
    }
};

// Controlador para actualizar la edad un paciente registrado
const actualizarPaciente = async (req, res = response) => {
    // Requiere de los datos de usuario para proceder:
    const token = req.header('x-token');
    const userData = await getUserData(token);

    const id = req.params.id; // ID del paciente
    const id_userLogged = userData.userID // ID del usuario que actualizó

    // Promesa...
    try {
        // Actualizando la edad de un paciente
        const paciente = await Paciente.findById(id); // Busca un paciente mediante ID
        if (!paciente) { // Si no existe el paciente solicitado, entonces...
            return res.status(404).json({ // Muestra el estado de la petición...
                ok: false,
                header: 'Vaya...',
                msg: 'El paciente no encontrado, proporciona un ID válido.'
            }); // Retorna mensaje de error.
        };

        // Si existe el paciente, entonces...
        const actualizaPaciente = { ...req.body, usuario: id_userLogged} ; // Extrae el nombre proporcionado
        // ... Guarda los cambios en al base de datos
        const pacienteActualizado = await Paciente.findByIdAndUpdate(id, actualizaPaciente, { new: true });

        // ... Muestra el resultado de la petición
        res.json({
            ok: true,
            msg: 'Paciente actualizado exitosamente!!!',
            data: pacienteActualizado
        });
    } catch (error) { // Si no se puede actualizar el paciente, entonces:
        console.log(error); // ... Imprime el error en consola
        res.status(500).json({ // ... Muestra el estado de la petición
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // ... Muestra el mensaje de error
    };
};

// Controlador para eliminar un paciente
const borrarPaciente = async (req, res = response) => {
    // Requiere el ID del paciente a actualizar:
    const id = req.params.id; // ID del paciente

    // Promesa...
    try {
        // Borrando un paciente:
        const paciente = await Paciente.findById(id); // Busca un paciente mediante ID
        if (!paciente) { // Si no existe el paciente solicitado, entonces...
            return res.status(404).json({ // Muestra el estado de la petición...
                ok: false,
                header: 'Vaya...',
                msg: 'El paciente no ha sido encontrado, proporcione un ID válido'
            }); // Retorna mensaje de error.
        };

        // Si exite el paciente, entonces...
        await Paciente.findByIdAndDelete(id); // Borra el paciente seleccionado
 
        // ...Muestra el resultado de la petición
        res.json({
            ok: true,
            header: '¡Paciente eliminado exitosamente!',
            msg: 'Datos del paciente eliminado:',
            nombrePaciente: paciente.nombre,
            idPaciente: paciente.id
        });
    } catch (error) { // Si no se puede borrar el paciente, entonces:
        console.log(error); // ...Imprime el error en consola
        res.status(500).json({ // ...Muestra el estado de la petición
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // ... Muestra el mensaje de error
    };
};

// Exportaciones
module.exports = {
    obtenerPacientes,
    crearPaciente,
    actualizarPaciente,
    borrarPaciente
};