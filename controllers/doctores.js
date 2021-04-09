/**
 *  Controlador de peticiones para:
 *      - (GET) Listar a los doctores registrados,
 *      - (POST) Registrar un nuevo doctor,
 *      - (PUT) Actualizar un doctor,
 *      - (DELETE) Eliminar un doctor del registro
*/

// Importaciones
const { request, response } = require('express');

const Doctor = require('../models/doctores');
const { getUserData } = require('../middlewares/existe-jwt');

// Controlador para listar los doctores registrados
const obtenerDoctores = async (req, res = response) => {
    // Obteniendo los doctores:
    // const doctores = await Doctor.find() // Busca los doctor
    //     .populate('usuario', 'nombre role') // Muestra todos los datos del usuario que hizo el registro.

    // Filtrando número de usuarios mostrados:
    const desde = Number(req.query.desde) || 0; // Obtiene el parámetro y lo transforma a número, si no exite, por defecto es 0
    /** PRUEBA: Imprime en consola el número de página solicitado. */ 
    // console.log(desde);
    // console.log(req.query);

    // Promesa...
    const [doctores, total] = await Promise.all([ // Muestra el resultado de las siguientes promesas:
        // Lista los usuarios existentes en la base de datos:
        Doctor
            .find({}) // También filtra parámetros
            .skip(desde) // Muestra desde el número de usuario registrado
            .limit(10), // Limita a 5 resultados
        
        // Conteo de usuarios registrados
        Doctor.countDocuments()
    ]);

    // Imprimiendo al respuesta de la petición
    res.json({
        ok: true, // Listado exitoso
        total,
        doctores // Lista de doctores registrados
    });
}

// Controlador para registrar un nuevo doctor
const crearDoctor = async (req = request, res = response) => {
    // Requiere de los datos de usuario para proceder:
    const token = req.header('x-token');
    const userData = await getUserData(token);

    // Extrae los datos de usuario y crea un nuevo doctor:
    const id_userLogged = userData.userID
    /** PRUEBA: Imprime en consola el id extraído del token. */
    // console.log(id_userLogged);
    // ... una vez extraído el id de usuario, entonces:
    const doctor = new Doctor({
        usuario: id_userLogged,
        ...req.body
    });

    // Captura los datos del BODY:
    const { cedulaProf } = req.body;

    // Promesa...
    try {
        // Verifica si la cédula profesional es única en el registro:
        const existeCedula = await Doctor.findOne({cedulaProf}); // Busca la cédula en la base de datos
        if (existeCedula) {
            return res.status(400).json({
                ok: false,
                header: '¡Hey!',
                msg: 'Este médico ya está registrado.'
            });
        };

        // Si hay datos, entonces registra al nuevo doctor:
        const doctorDB = await doctor.save();

        // Imprime el resultado de la petición
        res.json({
            ok: true, // Registro exitoso!!!
            doctor: doctorDB // Nombre del doctor registrado
        });
    } catch (error) { // Si no se puede registrar al doctor, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador, o verifique inicio de sesión...'
        }); // Muestra el mensaje de error
    }
}

// Controlador para actualizar un doctor registrado
const actualizarDoctor = async (req, res = response) => {
    // Requiere de los datos de usuario para proceder:
    const token = req.header('x-token');
    const userData = await getUserData(token);
    const doctorID = req.params.id; 

    // Extrae los datos de usuario y crea un nuevo doctor:
    const id_userLogged = userData.userID

    // Promesa...
    try {
        // Actualizando el nombre de un doctor
        const doctor = await Doctor.findById(doctorID); // Busca un doctor mediante ID
        if (!doctor) { // Si no existe el doctor solicitado, entonces...
            return res.status(404).json({ // Muestra el estado de la petición...
                ok: false,
                msg: 'Doctor no encontrado, proporcione una ID válida'
            }); // Retorna mensaje de error.
        }

        // Si existe el doctor, entonces...
        const actualizaDoctor = { ...req.body, usuario: id_userLogged} ; // Extrae el nombre proporcionado
        // ... Guarda los cambios en al base de datos
        const doctorActualizado = await Doctor.findByIdAndUpdate(doctorID, actualizaDoctor, { new: true });

        // ... Muestra el resultado de la petición.
        res.json({
            ok: true,
            header: '¡Doctor actualizado exitosamente!',
            data: doctorActualizado,
        });
    } catch (error) { // Si no se puede actualizar el doctor, entonces:
        console.log(error); // ... Imprime el error en consola
        res.status(500).json({ // ... Muestra el estado de la petición
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // ... Muestra el mensaje de error
    }
}

// Controlador para eliminar un doctor
const borrarDoctor = async (req, res = response) => {
    // Requiere el ID del doctor a actualizar:
    const id = req.params.id; // ID del doctor

    // Promesa...
    try {
        // Borrando un Doctor:
        const doctor = await Doctor.findById(id); // Busca un doctor mediante ID
        if (!doctor) { // Si no existe el doctor solicitado, entonces...
            return res.status(404).json({ // Muestra el estado de la petición...
                ok: false,
                header: 'Vaya...',
                msg: 'El doctor no ha sido encontrado, proporcione un ID válido.'
            }); // Retorna mensaje de error.
        }

        // Si exite el doctor, entonces...
        await Doctor.findByIdAndDelete(id); // Borra el doctor seleccionado
 
        // ...Muestra el resultado de la petición
        res.json({
            ok: true,
            header: '¡Doctor eliminado exitosamente!',
            msg: 'Datos del doctor:',
            doctorName: doctor.nombre,
            cedulaProf: doctor.cedulaProf,
            doctorId: doctor.id,
        });
    } catch (error) { // Si no se puede borrar el doctor, entonces:
        console.log(error); // ...Imprime el error en consola
        res.status(500).json({ // ...Muestra el estado de la petición
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // ... Muestra el mensaje de error
    }
}

// Exportaciones
module.exports = {
    obtenerDoctores,
    crearDoctor,
    actualizarDoctor,
    borrarDoctor
}