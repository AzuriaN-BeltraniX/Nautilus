/**
 *  Controlador de peticiones para:
 *      - Obtener un listado de los productos registrado en un inventario específico,
 *      - Registrar un nuevo producto,
 *      - Actualizar los datos de un producto registrado,
 *      - Actualizar las existencias de un producto en uno o varios inventarios,
 *      - Eliminar un producto.
*/

// Importaciones
const { request, response } = require('express');

const Producto = require('../models/producto');
const Almacen = require('../models/almacen')
const { getUserData } = require('../middlewares/existe-jwt');

// Controlador para listar productos registrados:
const obtenerProductos = async (req = request, res = response) => {
    // Obteniendo los productos:
    // const productos = await Almacen.find() // Busca los productos
    //     .populate('usuario', 'nombre role') // Muestra todos los datos del usuario que hizo el registro.

    // Filtrando número de productos mostrados:
    const desde = Number(req.query.desde) || 0; // Obtiene el parámetro y lo transforma a número, si no exite, por defecto es 0
    /** PRUEBA: Imprime en consola el número de página solicitado. */ 
    // console.log(desde);
    // console.log(req.query);

    // Promesa...
    const [productos, total] = await Promise.all([ // Muestra el resultado de las siguientes promesas:
        // Lista los usuarios existentes en la base de datos:
        Producto
            .find({}) // También filtra parámetros
            .skip(desde) // Muestra desde el número de usuario registrado
            .limit(10) // Limita a 5 resultados
            .populate('usuario', 'nombre'), // Muestra todos los datos del usuario que hizo el registro.
        
        // Conteo de usuarios registrados
        Producto.countDocuments()
    ]);

    // Imprimiendo al respuesta de la petición
    res.json({
        ok: true, // Listado exitoso
        total,
        productos // Lista de doctores registrados
    });
};

// Controlador para registrar un nuevo producto:
const crearProducto = async (req = request, res = response) => {
    // Requiere de los siguientes datos para continuar:
    const token = req.header('x-token');
    const userData = await getUserData(token);
    const id_userLogged = userData.userID;

    // Intenta registrar el nuevo producto:
    try {
        // ... Busca los almacenes registrados y realiza las siguientes acciones;
        await Almacen.find({}, async (err, almacenes) => {
            // ... si hay un error al encontrar almacenes, entonces muestra mensaje en la respuesta de la petición,
            if (err) {
                return res.status(404).json({
                    ok: false,
                    header: "Vaya...",
                    msg: "Esto de debería pasar, si intentas registrar un producto y no hay almacenes, crea un almacén antes de registrar un nuevo producto, caso contrario; si hay almacenes registrados, informa de este inconveniente al administrador."
                });
            // ... si no hay errores, entonces haz lo siguiente;
            } else {
                // ... ingresa los almacenes encontrado en el arreglo de "inventarioTemp",
                const inventarioTemp = [];
                almacenes.forEach((almacen) => {
                    inventarioTemp.push({almacen});
                });

                // ... captura los datos del nuevo producto desde el BODY,
                const producto = new Producto({
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    precio: req.body.precio,
                    usuarioReg: id_userLogged,
                    inventario: inventarioTemp
                });
                /** PRUEBA: Imprime en consola los datos del nuevo producto. */
                // console.log(producto);

                // ... busca en la base de datos el nombre ingresado y haz lo siguiente;
                await Producto.find({nombre: req.body.nombre}, async (err, productos) => {
                    // ... si hay productos ya registrados con el nombre anterior, entonces muestra mensaje en la respuesta de la petición,
                    if (productos.length > 0) {
                        return res.status(406).json({
                            ok: false,
                            header: '¡Hey!',
                            msg: 'Ya existe un producto con este nombre, si se trata de un error, reporta al administrador sobre este incidente.'
                        });
                    } else {
                        // ... almacena el nuevo producto en la base de datos,
                        await producto.save((err, prodSaved) => {
                            // ... si hay error al guardar, muestra un mensaje de error en la respuesta de la petición,
                            if (err) {
                                console.log(err);
                                return res.status(200).json({
                                    ok: false,
                                    header: 'Mmm...',
                                    msg: 'No se pudo registrar el nuevo producto, reporta este inconveniente al administrador.'
                                });
                            // ... si no hay error, entonces muestra un mensaje de éxito en la respuesta de la petición.
                            } else {
                                return res.status(201).json({
                                    ok: true,
                                    header: '¡Producto registrado correctamente!',
                                    producto: prodSaved
                                });
                            };
                        });
                    }
                });
            };
        });
    } catch (error) { // Si no se pudo registrar un nuevo producto, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Muestra el mensaje de error
    };
};

// Controlador para actualizar un producto registrado:
const actualizarProducto = async (req = request, res = response) => {
    // Requiere de los siguientes datos para continuar:
    const token = req.header('x-token');
    const userData = await getUserData(token);
    const id_userLogged = userData.userID;
    const id_productSelected = req.params.id

    // Intenta actualizar el producto seleccionado...
    try {
        // Busca el producto seleccionado en la base de datos:
        await Producto.findById(id_productSelected, async (err, productFound) => {
            // ... Valida la exitencia del producto:
            if (!productFound) {
                return res.status(404).json({
                    ok: false,
                    header: 'Mmm...',
                    msg: 'El producto que quieres actualizar no existe, si se trata de un error, informa al administrador de este inconveniente.'
                });
            // ... si el producto fue encontrado, entonces realiza lo siguiente;
            } else {
                // ... captura los datos del nuevo producto desde el BODY,
                const actualizaProducto = {
                    nombre: req.body.nombre || productFound.nombre,
                    descripcion: req.body.descripcion || productFound.descripcion,
                    precio: req.body.precio || productFound.precio,
                    usuarioReg: id_userLogged,
                    inventario: productFound.inventario
                };

                // ... prepara la actualización del producto;
                await Producto.findByIdAndUpdate(id_productSelected, actualizaProducto, { new: true }, (err, productUpdated) => {
                    // ... valida la operación y haz lo siguiente;
                    if (err) {
                        console.log(err);
        
                        return res.status(400).json({
                            ok: false,
                            header: 'Mmmm...',
                            msg: 'No se ha podido actualizar el producto, informa al administrador sobre el inconveniente.'
                        });
                    } else {
                        return res.status(200).json({
                            ok: true,
                            header: 'Producto actualizado exitosamente!',
                            producto: productUpdated
                        });
                    };
                });
            };
        });
    } catch (error) { // Si no se pudo actualizar el producto seleccionado, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Muestra el mensaje de error
    };
};

// Controlador para actualizar las existencias de un producto en un almacen seleccionado:
const actualizarExistencias = async (req = request, res = response) => {
    // Requiere de los siguientes datos:
    const productoID = req.query.product;
    const almacenID = req.query.stock;
    const existsAvailable = req.body.existencias;

    // Intenta actualizar las existencias de un producto:
    try {
        // Busca el ID del prodcuto solicitado;
        await Producto.findById(productoID, async (err, producto) => {
            // ... si no existe el producto solicitado, retorna un mensaje de error en la respuesta de la petición,
            if (!producto) {
                return res.status(404).json({
                    ok: false,
                    header: 'Vaya...',
                    msg: 'El ID que haz proporcionado no es válido, ingresa un ID de producto existente.'
                });
            // ... si existe el producto solicitado, entonces realiza lo siguiente;
            } else {
                // ... crea un inventario temporal,
                const inventarioTmp = [];
                // ... extrae los datos de los inventarios del producto registrado,
                producto.inventario.forEach((items) => {
                    // ... su el almacen seleccionado es igual al almacen solicitado, entonces actualiza la cantidad,
                    if (items.almacen.toString() === almacenID) {
                        if (existsAvailable < 0) {
                            items.cantidad = items.cantidad;
                        } else {
                            items.cantidad = existsAvailable;
                        }
                    };

                    // ... y los inventarios actualizados añádelos al inventario temporal,
                    inventarioTmp.push(items)
                });

                // ... captura los datos del nuevo producto desde el BODY,
                const productoActualizado = {
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    usuarioReg: producto.usuarioReg,
                    inventario: inventarioTmp
                };

                // ... y prepara la actualización del producto;
                await Producto.findByIdAndUpdate(productoID, productoActualizado, { new: true }, (err, productUpdated) => {
                    // ... valida la operación y haz lo siguiente;
                    if (err) {
                        console.log(err);
        
                        return res.status(400).json({
                            ok: false,
                            header: 'Mmmm...',
                            msg: 'No se ha podido actualizar el producto, informa al administrador sobre el inconveniente.'
                        });
                    } else {
                        return res.status(200).json({
                            ok: true,
                            header: `¡Existencias actualizadas exitosamente!`,
                            producto: productUpdated
                        });
                    };
                });
            };
        });
    } catch (error) { // Si no se puede eliminar el producto, entonces:
        console.log(error); // Imprime el error,
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // ... y muestra el mensaje de error.
    }
};

// Controlador para eliminar un producto registrado:
const eliminarProducto = async (req = request, res = response) => {
    // Requiere de los siguientes datos:
    const productoID = req.params.id;

    // Intenta eliminar el almacén solicitado...
    try {
        // Busca el ID del almacén solicitado;
        const existeProducto = Producto.findById(productoID);
        // ... si no existe el almacén solicitado, retorna un mensaje de error en la respuesta de la petición.
        if (!existeProducto) {
            return res.status(404).json({
                ok: false,
                header: 'Vaya...',
                msg: 'El ID que haz proporcionado no es válido, ingresa un ID de producto existente.'
            });
        };

        // Elimina el almacén:
        await Producto.findByIdAndDelete(productoID, (err) => {
            // ... Valida la operación y realiza lo siguiente:
            if (err) {
                console.log(err);

                return res.status(400).json({
                    ok: false,
                    header: 'Mmmm...',
                    msg: 'No se ha podido eliminar el producto, informa al administrador sobre el inconveniente.'
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    header: '¡Producto eliminado exitosamente!'
                });
            };
        })
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
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    actualizarExistencias,
    eliminarProducto
};