/**
 *  Controlador de peticiones para:
 *      - Obtener un listado de los almacenes registrados,
 *      - Registrar un nuevo almacén,
 *      - Actualizar los datos de un almacén registrado,
 *      - Eliminar un almacén.
*/

// Importaciones
const { request, response } = require('express');

const Almacen = require('../models/almacen');
const Producto = require('../models/producto');
const { getUserData } = require('../middlewares/existe-jwt');

// Controlador para listar almacenes registrados:
const obtenerAlmacenes = async (req = request, res = response) => {
    // Obteniendo los almacenes:
    // const almacenes = await Almacen.find() // Busca los almacenes
    //     .populate('usuario', 'nombre role') // Muestra todos los datos del usuario que hizo el registro.

    // Filtrando número de almacenes mostrados:
    const desde = Number(req.query.desde) || 0; // Obtiene el parámetro y lo transforma a número, si no exite, por defecto es 0
    /** PRUEBA: Imprime en consola el número de página solicitado. */ 
    // console.log(desde);
    // console.log(req.query);

    // Promesa...
    const [almacenes, total] = await Promise.all([ // Muestra el resultado de las siguientes promesas:
        // Lista los usuarios existentes en la base de datos:
        Almacen
            .find({}) // También filtra parámetros
            .skip(desde) // Muestra desde el número de usuario registrado
            .limit(10) // Limita a 5 resultados
            .populate('usuarioReg'), // Muestra todos los datos del usuario que hizo el registro.
        
        // Conteo de usuarios registrados
        Almacen.countDocuments()
    ]);

    // Imprimiendo al respuesta de la petición
    res.json({
        ok: true, // Listado exitoso
        total,
        almacenes // Lista de doctores registrados
    });
};

// Controlador para crear un nuevo almacén:
const crearAlmacen = async (req = request, res = response) => {
    // Requiere de los siguientes datos para continuar:
    const token = req.header('x-token');
    const userData = await getUserData(token);
    const id_userLogged = userData.userID;

    // Extrae el nombre del nuevo almacen desde el BODY y realiza lo siguiente:
    const nombreAlmacen = req.body.nombre;

    // ... Intenta registrar el nuevo almacen;
    try {
        // ... verifica la existencia del almacen, si existe muestra mensaje de error,
        const existeAlmacen = Almacen.findOne({nombreAlmacen});
        if (!existeAlmacen) {
            return res.status(400).json({
                ok: false,
                header: 'Este almacen ya existe. Si es un error, informa al administrador sobre este inconveniente'
            });
        };

        // ... agrupa los datos para registrar el nuevo almacen,
        const almacen = new Almacen({
            usuario: id_userLogged,
            ...req.body
        });

        // ... y almacena el nuevo almacén en la base de datos, mostrando un mensaje después del registro;
        await almacen.save((err, stockData) => {
            // ... si existe un error, muestra un mensaje de la respuesta de la petición y en consola el error,
            if (err) {
                console.log(err);

                return res.status(400).json({
                    ok: false,
                    header: 'Mmmm...',
                    msg: 'No se ha podido registrar el nuevo almacén, informa al administrador sobre el inconveniente.'
                });
            // ... si no existe error, entonces realiza lo siguiente:
            } else {
                // ... lista los productos y añade el nuevo almacén dentro del inventario de cada producto,
                Producto.find({}, (err, productos) => {
                    productos.forEach((producto) => {
                        /** PRUEBA: Imprime en consola los productos listados. */
                        // console.log(producto);

                        // ... crea un inventario temparal y añade los datos del nuevo almacén,
                        const inventarioTmp = producto.inventario;
                        const almacenID = stockData._id;

                        inventarioTmp.push({ ...inventarioTmp, almacen: almacenID });

                        // ... reemplaza el inventario temporal por el invntario ya registrado,
                        producto.inventario = inventarioTmp;

                        // ... guarda los cambios y muestra mensaje en la respuesta de la petición.
                        producto.save();
                    });
                });

                return res.status(201).json({
                    ok: true,
                    header: '¡Almacén registrado exitosamente!',
                    almacen: stockData
                });
            };
        });
    } catch (error) { // Si no se pudo registrar un nuevo almacén, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Muestra el mensaje de error
    }
};

// Controlador para actualizar un almacén:
const actualizarAlmacen = async (req = request, res = response) => {
    // Requiere de los siguientes datos para continuar:
    const token = req.header('x-token');
    const userData = await getUserData(token);
    const id_userLogged = userData.userID
    const almacenID = req.params.id; 

    // Intenta actualizar los datos del almacén:
    try {
        const almacen = await Almacen.findById(almacenID); // ... Busca un almacénn mediante ID,
        if (!almacen) { // ...Si no existe el almacen solicitado, entonces...
            return res.status(404).json({ // muestra el estado de la petición,
                ok: false,
                msg: 'Almacén no encontrado, proporcione una ID válida'
            }); // ...y retorna mensaje de error.
        }

        // Si existe el almacén, entonces...
        const actualizaAlmacen = { ...req.body, usuarioReg: id_userLogged } ; // Extrae el nombre proporcionado
        // ... Guarda los cambios en al base de datos:
        await Almacen.findByIdAndUpdate(almacenID, actualizaAlmacen, { new: true }, (err, storeUpdated) => {
            // ... Valida la operación y haz lo siguiente;
            if (err) {
                console.log(err);

                return res.status(400).json({
                    ok: false,
                    header: 'Mmmm...',
                    msg: 'No se ha podido actualizar el almacén, informa al administrador sobre el inconveniente.'
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    header: '¡Almacén actualizado exitosamente!',
                    almacen: storeUpdated
                });
            };
        });
    } catch (error) { // Si no se puede actualizar el almacen, entonces:
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Muestra el mensaje de error
    };
};

// Controlador para eliminar un almacén:
const eliminarAlmacen = async (req = request, res = response) => {
    // Requiere de los siguientes datos:
    const almacenID = req.params.id;
    const flag = req.header('flag');

    // Intenta eliminar el almacén solicitado...
    try {
        // Busca el ID del almacén solicitado;
        const existeAlmacen = Almacen.findById(almacenID);
        // ... si no existe el almacén solicitado, retorna un mensaje de error en la respuesta de la petición.
        if (!existeAlmacen) {
            return res.status(404).json({
                ok: false,
                header: 'Vaya...',
                msg: 'El ID que haz proporcionado no es válido, ingresa un ID de almacén existente.'
            });
        };
        
        // Elimina el almacén:
        await Almacen.findByIdAndDelete(almacenID, (err) => {
            // ... Valida la operación y realiza lo siguiente:
            if (err) {
                console.log(err);

                return res.status(400).json({
                    ok: false,
                    header: 'Mmmm...',
                    msg: 'No se ha podido eliminar el almacén, informa al administrador sobre el inconveniente.'
                });
            } else {
                // ... lista los productos y añade el nuevo almacén dentro del inventario de cada producto,
                Producto.find({}, (err, productos) => {
                    productos.forEach((producto) => {
                        /** PRUEBA: Imprime en consola los productos listados. */
                        // console.log(producto);

                        // ... crea un inventario temparal y añade los datos del nuevo almacén,
                        const inventarioTmp = producto.inventario;

                        inventarioTmp.forEach((item, index, object) => {
                            if (almacenID.toString() === item.almacen._id.toString()) {
                                object.splice(index, 1);
                            };
                        });

                        producto.inventario = inventarioTmp;
                        producto.save();
                    });
                });

                return res.status(200).json({
                    ok: true,
                    header: '¡Almacén eliminado exitosamente!'
                });
            };
        });
    } catch (error) { // Si no se puede eliminar el almacén, entonces:
        console.log(error); // Imprime el error,
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // ... y muestra el mensaje de error.
    }
};

// Exportaciones:
module.exports = {
    obtenerAlmacenes,
    crearAlmacen,
    actualizarAlmacen,
    eliminarAlmacen
};