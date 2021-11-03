/**
 *  Controlador de peticiones para:
 *      - (GET) Listar los usuarios registrados,
 *      - (POST) Registrar a un nuevo usuario,
 *      - (PUT) Actualizar un usuario registrado,
 *      - (DELETE) Eliminar un usuario registrado.
 */

// Importaciones
const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { welcome_Email, successResetPwdAction_Email } = require('../controllers/email');
const { getUserData, getTokenData } = require('../middlewares/existe-jwt');
const { generarJWT } = require('../helpers/jwt');

// Controlador para obtener usuarios:
const obtenerUsuarios = async(req = request, res = response) => {
    /** PRUEBA: Muestra un mensaje en la petición indicando que el servicio funciona. */
    // console.log('Creando usuario...');
   
    // Filtrando número de usuarios mostrados:
    const desde = Number(req.query.desde) || 0; // Obtiene el parámetro y lo transforma a número, si no exite, por defecto es 0
    /** PRUEBA: Imprime en consola el número de página solicitado. */ 
    // console.log(desde);
    // console.log(req.query);

    // Promesa...
    const [usuarios, total] = await Promise.all([ // Muestra el resultado de las siguientes promesas:
        // Lista los usuarios existentes en la base de datos:
        Usuario
            .find({}, 'nombre email role google img') // También filtra parámetros
            .skip(desde) // Muestra desde el número de usuario registrado
            .limit(10), // Limita a 5 resultados
        
        // Conteo de usuarios registrados
        Usuario.countDocuments()
    ]);

    // Obten los datos del usuario desde el token:
    const token = req.header('x-token')
    const userData = await getUserData(token);
    /** PRUEBA: Imprime en consola el token extraído y los datos de usuario. */
    // console.log(token, userData);

    // Si se pudo ejecutar la búsqueda, entonces imprime el resultado de la petición.
    await res.json({
        ok: true,
        usuarios,
        total,
        buscador: {
            usuario: userData.nombre,
            id: userData.userID
        }
    });
};

// Controlador para crear usuarios:
const crearUsuarios_per = async(req = request, res = response) => {
    /** PRUEBA: Muestra un mensaje en la petición indicando que el servicio funciona. */
    // console.log('Creando usuario...');

    // Captura datos
    const { nombre, email, password } = req.body;

    // Promesa...
    try {
        // Busca email en el registro, para evitar duplciados.
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) { // Si existe el email, entonces...
            return res.status(400).json({
                ok: false,
                header: '¡Hey!',
                msg: 'El correo que ingresaste ya está registrado, intenta con uno diferente.'
            }); // Retorna el menssaje de error.
        };

        // Creación del Usuario
        const usuario = new Usuario(req.body); // Crea un usuario

        // Encriptación de la contraseña.
        const salt = bcrypt.genSaltSync(10); // Genera la encriptación
        usuario.password = bcrypt.hashSync(password, salt); // Determina el parámetro a encriptar

        // Verificación de contraseña segura mediante expresión regular:
        /** Desc. RegExp: Contraseña de 8 a 16 caracteres, incluyendon dígitos, símbolos y letras Mayus-Minus. */
        const pattern = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040\u005f])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/g;
        const isValid = pattern.test(toString(usuario.password));

        // Si la contraseña no cumple el RegExp, entonces:
        if (!isValid) {
            // Retorna mensaje de error con la indicación de solución:
            res.status(406).json({
                ok: false,
                header: '¡Hey!',
                msg: 'La contraseña debe incluir al menos minúsculas o mayúsculas, números y símbolos. Recuerda incluir mínimo 8 caracteres.'
            });
        } else {
            // Guarda al usuario creado
            await usuario.save();
    
            // Si el correo y contraseñas son válidas, entonces genera un TOKEN (JWT):
            const token = await generarJWT(usuario, '30d'); // Expira en 30 días
    
            // Envía el correo de bienvenida al email del usuario registrado:
            welcome_Email(email, nombre).then(async resp => {
                /** PRUEBA: Imprime en pantalla la respuesta del correo de bienvenida. */
                // console.log(resp);
    
                if (resp['ok'] === true) {
                    // Respuesta de la petición al guardar usuario:
                    res.status(200).json({
                        ok: true, // Creación exitosa!!!
                        ok_SendEmail: true, // Email enviado correctamente
                        message_SendEmail: {
                            header: resp['header'],
                            msg: resp['msg']
                        }, // Mensaje de éxito al enviar un correo electrónico
                        usuario, // Muestra los datos del usuario creado
                        token // Muestra el TOKEN generado.
                    });
                } else {                
                    // Respuesta de la petición al guardar usuario:
                    res.status(200).json({
                        ok: true, // Creación exitosa!!!
                        ok_SendEmail: false, // Email no enviado...
                        message_SendEmail: {
                            header: resp['header'],
                            msg: resp['msg']
                        }, // Mensaje de error al enviar un correo electrónico
                        usuario, // Muestra los datos del usuario creado
                        token // Muestra el TOKEN generado.
                    });
                }
            });
        };
    } catch(error) { // Si no se puede crear usuario, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Retorna el mensaje de error.
    }
};

// Controlador para crear usuarios:
const crearUsuarios = async(req = request, res = response) => {
    /** PRUEBA: Muestra un mensaje en la petición indicando que el servicio funciona. */
    // console.log('Creando usuario...');

    // Captura datos
    const { nombre, email, password } = req.body;

    // Promesa...
    try {
        // Busca email en el registro, para evitar duplciados.
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) { // Si existe el email, entonces...
            return res.status(400).json({
                ok: false,
                header: '¡Hey!',
                msg: 'El correo que ingresaste ya está registrado, intenta con uno diferente.'
            }); // Retorna el menssaje de error.
        };

        // Creación del Usuario
        const usuario = new Usuario(req.body); // Crea un usuario

        // Encriptación de la contraseña.
        const salt = bcrypt.genSaltSync(10); // Genera la encriptación
        usuario.password = bcrypt.hashSync(password, salt); // Determina el parámetro a encriptar

        // Guarda al usuario creado
        await usuario.save();

        // Si el correo y contraseñas son válidas, entonces genera un TOKEN (JWT):
        const token = await generarJWT(usuario, '30d'); // Expira en 30 días

        // Envía el correo de bienvenida al email del usuario registrado:
        welcome_Email(email, nombre).then(async resp => {
            /** PRUEBA: Imprime en pantalla la respuesta del correo de bienvenida. */
            // console.log(resp);

            if (resp['ok'] === true) {
                // Respuesta de la petición al guardar usuario:
                res.status(200).json({
                    ok: true, // Creación exitosa!!!
                    ok_SendEmail: true, // Email enviado correctamente
                    message_SendEmail: {
                        header: resp['header'],
                        msg: resp['msg']
                    }, // Mensaje de éxito al enviar un correo electrónico
                    usuario, // Muestra los datos del usuario creado
                    token // Muestra el TOKEN generado.
                });
            } else {                
                // Respuesta de la petición al guardar usuario:
                res.status(200).json({
                    ok: true, // Creación exitosa!!!
                    ok_SendEmail: false, // Email no enviado...
                    message_SendEmail: {
                        header: resp['header'],
                        msg: resp['msg']
                    }, // Mensaje de error al enviar un correo electrónico
                    usuario, // Muestra los datos del usuario creado
                    token // Muestra el TOKEN generado.
                });
            }
        });
    } catch(error) { // Si no se puede crear usuario, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Retorna el mensaje de error.
    }
};

// Controlador para actualizar usuarios:
const actualizarUsuarios = async(req = request, res = response) => {
    // Requiere de los siguientes datos;
    const token = req.header('x-token')
    const userID = req.params.id;
    // console.log(userID);

    // Obtén el ID del usuario en sesión:
    const userData = await getUserData(token)
    const id_userLogged = userData.userID;

    // Promesa...
    try {
        // Busca un usuario existente mediante un ID:
        const usuarioDB = await Usuario.findById(userID);
        // Si no encuentra un usuario, entonces...
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario con el id ${userID}, proporciona un ID válido.`
            }); // Imprime el mensaje de error.
        };

        // Verifica si el correo a actualizar ya existe:
        const { password, // ... omite el la actualización a la contraseña
                google, // ... omite la actualización a autenticación por Google
                email, // ... "omite" el email
                ...campos } = req.body; // Requiere el BODY para obtener los campos a actualizar
        // ...Si el correo electrónico es diferente, entonces...
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({email}) // Busca el correo existente, pero...
            if (existeEmail) { // Si existe el correo, entonces...
                return res.status(400).json({
                    ok: false,
                    header: 'Vaya...',
                    msg: 'Ya existe un usuario con el correo electrónico que ingresaste, usa uno diferente o informa al administrador sobre este inconveniente.'
                }); // Retorna un mensaje de error.
            };
        };

        // Verifica si el usuario que intenta actualizar su correo es de Google, si es así, entonces:
        if (!usuarioDB.google) {
            campos.email = email; // Email a actualizar:
        } else if (usuarioDB.email !== email) { // Si el correo de google es diferente e intenta actualizar, entonces:
            return res.status(400).json({
                ok: false,
                header: '¡Te atrapé!',
                msg: 'Eres un usuario de Google, no puedes actualizar tu correo electrónico.'
            }); // Retorna un mensaje de error.
        }

        // Actualiza el usuario requiriendo el ID de usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate(userID, campos, {new: true});
        /** PRUEBA: Imprime los datos actualizados del usuario. */
        // console.log(usuarioActualizado);

        // Si el usuario actualizó su propia información, lanza un nuevo token con la información actualizada:
        if (userID === id_userLogged) {
            const newToken = await generarJWT(usuarioActualizado, '30d');
            /** PRUEBA: Imprime el nuevo Token en Consola. */
            // console.log(newToken);

            return res.json({
                ok: true,
                usuario: usuarioActualizado,
                token: newToken
            });
        // ... si es un administrador modificando un nuevo usuario, entonces:
        } else if (userID !== id_userLogged) {
            return res.json({
                ok: true,
                usuario: usuarioActualizado
            });
        };
    } catch (error) { // Si no se puede actualizar el usuario, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'El usuario no se ha podido actualizar, reporta este inconveniente al administrador.'
        }); // Retorna el mensaje de error
    }
};

// Controlador para borrar los usuarios:
const borrarUsuarios = async(req = request, res = response) => {
    // Requiere del ID de usuario
    const userID = req.params.id;

    // Promesa...
    try {
        // Busca un usuario existente mediante un ID:
        const usuarioDB = await Usuario.findById(userID);

        if (!usuarioDB) { // Si no encuentra un usuario, entonces...
            return res.status(404).json({
                ok: false,
                msg: `No existe un usuario con el ID: '${userID}', proporciona un ID válido.`
            }); // Imprime el mensaje de error.
        }

        await Usuario.findByIdAndDelete(userID) // Si existe un usuario

        // /* Prueba de data
            res.json({
                ok: true,
                header: '¡Usuario eliminado correctamente!',
                msg: `El usuario '${userID}', fue eliminado con éxito.`
            })
    } catch(error) { // Si no se puede borrar el usuario entonces...
        console.log(error); // Muestra error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'No se ha podido eliminar el usuario, por favor reporta este inconveniente al administrador.'
        }); // Imprime mensaje de error.
    }
};

// Controlador para actualizar la contraseña de un usuario:
const actualizarPwd_Usuario = async (req = request, res = response, )  => {
    // Extrae la nueva contraseña ingresada del BODY y el token recibido de Header:
    const newUserPwd = req.body.password;
    const specialToken = req.header('specialToken') || req.query.token;
    /** Imprime en consola la nueva contraseña ingresada. */
    // console.log(newUserPwd);
    // console.log(specialToken);

    // Si no existe una contraseña ingresada, entonces muestra la siguiente respuesta en la petición:
    if (newUserPwd === '') {
        return res.status(406).json({
            ok: false,
            header: '¡Hey!',
            msg: 'Debes escribir una contraseña.',
            instructions: {
                no1: 'Mínimo 8 caracteres.',
                no2: 'Te recomendamos usar mayúsculas, minúsculas, números y/o caracteres especiales.'
            }
        });
    };

    // Si no existe una token en la petición, entonces muestra la siguiente respuesta en la petición:
    if (specialToken === '') {
        return res.status(406).json({
            ok: false,
            header: '¡Hey! Ingresa un Token para continuar...',
            msg: 'Recuerda; expira en 5 minutos después de solicitar tu cambio de contraseña.'
        });
    };

    // Obtén los datos del usuario desde el token recibido;
    getTokenData(specialToken).then(async results => {
        /** PRUEBA: Imprime el resultado de la promesa. */
        // console.log(results);
        
        // Valida la respuesta de la promesa y realiza lo siguiente:
        if (results['ok'] === false) {
            // ... si el token ha expirado, entonces:
            return res.status(406).json({
                ok: results['ok'],
                msg: results['msg']
            });
        } else {
            // ... si el token es correcto, entonces extrae el ID de usuario almacenado:
            const userID = results.decoded.user.userID;
            /** PRUEBA: Imprime el ID extraído. */
            // console.log(userID);

            // ... Busca la ID de usuario en la base de datos,
            const usuario = await Usuario.findById(userID);
            // ... si no existe el usuario registrado, entonces retorna el error en la respuesta de la petición:
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    header: 'Oh no...',
                    msg: 'No se encontró al usuario que se eesperaba encontrar, informa al administrador sobre este inconveniente.'
                });
            // ... si existe el usuario entonces realiza lo siguiente;
            } else {
                // ... verifica la llave dentro del TOKEN, si es correcta, entonces cambia la contraseña;
                if (results.decoded.user.key === process.env.VALID_SPECIALTOKEN) {
                    // ... de la contraseña actual, reemplázala por una nueva contraseña encriptada,
                    usuario.password = bcrypt.hashSync(newUserPwd, 10);
                    usuario.tmpCode = '';

                    // ... guarda la nueva password:
                    await usuario.save((err) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                header: '¡Auch!',
                                msg: 'No fue posibile actualizar la contraseña, informa al administrador sobre este inconveniente.'
                            });
                        } else {
                            successResetPwdAction_Email(usuario.email, usuario.nombre).then(results => {
                                /** PRUEBA: Imprime en consola la respuesta de la promesa. */
                                // console.log(results);
    
                                // Valida la respuesta de la promesa y realiza lo siguiente:
                                if (results['ok'] === true) {
                                    return res.status(200).json({
                                        ok: true,
                                        header: '¡Excelente!',
                                        msg: 'La contraseña fue actualizada correctamente, compruébalo con el correo electrónico que te hemos enviado.'
                                    });
                                } else {
                                    return res.status(200).json({
                                        ok: true,
                                        header: '¡Excelente!',
                                        msg: 'La contraseña fue actualizada correctamente, aunque no se logró notificar esta acción a tu correo electrónico registrado.'
                                    });
                                };
                            });
                        };
                    });
                // ... si no es igual, entonces no realices una acción y muestra mensaje de error:
                } else {
                    return res.status(401).json({
                        ok: false,
                        header: 'Acción no autorizada.'
                    });
                };
            };

            // return res.status(200).json({
            //     ok: results['ok'],
            //     result: results['data']
            // });
        }
    });


    // Validando la contraseña del usuario solicitado
    // const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    // if (!validPassword) { // Si la contraseña no es válida, entonces...
    //     return res.status(400).json({
    //         ok: false,
    //         msg: "La contraseña es incorrecta."
    //     }); // Retorna el mensaje de error
    // }
};

// Exportaciones
module.exports = {
    obtenerUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuarios,
    actualizarPwd_Usuario
}