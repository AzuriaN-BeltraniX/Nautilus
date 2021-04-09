/**
 *  Controlador de:
 *      - Envío de correos electrónicos:
 *          - Correo de bienvenida,
 *          - Correo de reestablecimiento de contraseña
 *          - Correo de actualización de datos del usuario en sesión
*/

// Importaciones
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { registrarCodigo, generarCodigo } = require('../controllers/codigos');
const { request, response } = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

// Creación del "transporter" y "handlebarsOptions", contiene los siguientes datos:
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        // user: 'nola.pfannerstill@ethereal.email',
        // pass: 'f6kBgw6uVBwtUc7ZnE'
        user: process.env.EMAIL_SMTP,
        pass: process.env.PASS_SMTP
    }
});
const handlebarsOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve(__dirname, '../templates'),
        layoutsDir: path.resolve(__dirname, '../templates'),
        defaultLayout: null
    },
    viewPath: path.resolve(__dirname, '../templates'),
    extName: '.html'
};
transporter.use('compile', hbs(handlebarsOptions));

// Controlador para enviar un correo de bienvenida al registrarse:
const welcome_Email = (email, nombre) => {
    // Variables para usar dentro del cuerpo del correo:
    const year = new Date().getFullYear();
    const separandoNombre = nombre.split(' ');
    const nombreSeparado = separandoNombre[0];

    // Valida el correo electrónico ingresado:
    const pattern = /(^[0-9a-zA-Z]+(?:[._][0-9a-zA-Z]+)*)@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;
    const isValid = pattern.test(String(email).toLowerCase());
    // ... si los caracteres del correo son válidos entonces busca el correo electrónico en la base de datos;
    if (isValid) {
        // ... Si el correo ingresado es correcto, entonces prepara el cuerpo del mensaje,
        const mailOptions = {
            to: email,
            from: 'Nautilus',
            template: 'correoBienvenida',
            subject: `¡Hola, ${nombreSeparado}! Nautilus te da la bienvenida.`,
            context: {
                url: 'http://azurianbeltranix.com',
                nombre: nombre,
                nombreSeparado: nombreSeparado,
                year: year
            }
        };
        // ... y envía el correo electrónico:
        return new Promise (resolve => {
            transporter.sendMail(mailOptions, function(err) {
                // ... Si hay un error al crear un correo electrónico, muestra el error en la petición;
                if (err) {
                    resolve({
                        ok: false,
                        header: '¡Auch!',
                        msg: 'Ocurrió un problema al enviar el correo electrónico de bienvenida.',
                        errors: err
                    });
                } else {
                    // ... si no hay error, muestra mensaje de éxito en la petición.
                    resolve({
                        ok: true,
                        header: '¡Perfecto!',
                        msg: 'Correo enviado correctamente.'
                    });
                };
            });
        });
    // Si el email recibido no es válido, entonces muestra este mensaje en la respuesta:
    } else {
        return res.status(404).json({
            ok: false,
            header: '¡Hey!',
            msg: 'El correo proporcionado no tiene un formato correcto.'
        });
    };
};

// Controlador enviar un token por correo eletrónico, el cual servirá para actualizar la contraseña de un usuario:
const resetPwd_Email = (req = request, res = response) => {
    // Extrae los siguientes datos:
    const email = req.body.email;
    const flag = req.header('flag');

    // Valida los caracteres del email recibido:
    const pattern = /(^[0-9a-zA-Z]+(?:[._][0-9a-zA-Z]+)*)@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;
    const isValid = pattern.test(String(email).toLowerCase());
    
    // Si el email recibido es válido, entonces busca al usuario registrado con ese correo:
    if (isValid) {
        Usuario.findOne({email: email}, async (err, usuarioDB) => {
            // Si existe un error en la búsqueda del usuario, muestra en la respuesta el mensaje de error:
            if (err) {
                return res.status(500).json({
                    ok: false,
                    header: 'Vaya...',
                    msg: 'Esto no debería pasar, comunica al administrador sobre este inconveniente.'
                });
            };

            // Si no existe un usuario con el correo proporcionado, entonces muestra en la respuesta un mensaje; 
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    header: 'Vaya...',
                    msg: 'No existe un usuario con el correo que haz proporcionado.'
                });
            } else {
                /** PRUEBA: Imprime en consola al usuario encontrado. */
                // console.log('>> Usuario encontrado:', usuarioDB);

                // ... si existe el usuario, extrae los siguientes datos del usuario,
                const userID = usuarioDB._id;
                const userEmail = usuarioDB.email;
                const userName = usuarioDB.nombre;

                // ... verifica la bandera de acción, si es "onlyCode", relaiza lo siguiente:
                if (flag === 'onlyCode') {
                    // ... genera un código de 4 cifras,
                    await generarCodigo(1000, 9999).then(async code => {
                        /** PRUEBA: Imprime el código generado. */
                        // console.log('>>> Código generado:', code);
    
                        // ... configura los parámetros del email que se va a enviar,
                        const mailOptions = {
                            to: userEmail,
                            form: 'Nautilus',
                            template: 'resetPwd_code',
                            subject: 'Reestablece tu contraseña de tu cuenta en Nautilus.',
                            context: {
                                code: code,
                                nombre: userName
                            }
                        };
    
                        // ... almacena el código generado y envíalo mediante un correo al usuario,
                        await registrarCodigo(code, userID).then(value => {
                            if (value === true) {
                                // ... envía el correo electrónico, y ejecuta las siguientes acciones;
                                transporter.sendMail(mailOptions, function(err) {
                                    // ... Si hay un error al crear un correo electrónico, muestra el error en la petición,
                                    if (err) {
                                        res.json({
                                            ok: false,
                                            header: '¡Auch!',
                                            msg: 'Ocurrió un problema al enviar el correo electrónico de reestablecimiento de contraseña.',
                                            errors: err
                                        });
                                    } else {
                                        // ... si no hay error, muestra mensaje de éxito en la petición.
                                        res.json({
                                            ok: true,
                                            header: '¡Perfecto!',
                                            msg: 'Correo para cambiar contraseña enviado correctamente.'
                                        });
                                    };
                                });
                            } else {
                                res.status(400).json({
                                    ok: false,
                                    header: 'Vaya...',
                                    header: 'Ha habido un problema, dirígete a la consola y revisa las acciones realizadas.'
                                });
                            };
                        });
                    });
                // ... si la bandera es "onlyUrl", entonces haz lo siguiente:
                } else if (flag === 'onlyUrl') {
                    // ... genera un token y muéstralo en la respuesta de la petición:
                    const token = await generarJWT({
                        userID: usuarioDB._id,
                        key: process.env.VALID_SPECIALTOKEN
                    }, 300); // Expira en 5 minutos.

                    // ... configura los parámetros del email que se va a enviar,
                    const mailOptions = {
                        to: userEmail,
                        form: 'Nautilus',
                        template: 'resetPwd_url',
                        subject: 'Reestablece tu contraseña de tu cuenta en Nautilus.',
                        context: {
                            url: `http://${req.headers.host}/api/users/resetPwd-url/?token=${token}`,
                            nombre: userName
                        }
                    };

                    // ... envía el correo electrónico, y ejecuta las siguientes acciones;
                    transporter.sendMail(mailOptions, function(err) {
                        // ... Si hay un error al crear un correo electrónico, muestra el error en la petición,
                        if (err) {
                            res.json({
                                ok: false,
                                header: '¡Auch!',
                                msg: 'Ocurrió un problema al enviar el correo electrónico de bienvenida.',
                                errors: err
                            });
                        } else {
                            // ... si no hay error, muestra mensaje de éxito en la petición.
                            res.json({
                                ok: true,
                                header: '¡Perfecto!',
                                msg: 'Correo para cambiar contraseña enviado correctamente.'
                            });
                        };
                    });
                };
            };
        });
    // Si el email recibido no es válido, entonces muestra este mensaje en la respuesta:
    } else {
        return res.status(404).json({
            ok: false,
            header: '¡Hey!',
            msg: 'El correo proporcionado no tiene un formato correcto.'
        });
    };
};

// Controlador para enviar un correo de actualización de contraseña:
const successResetPwdAction_Email = (email, nombre) => {
    // Separa el nombre principal del usuario para mostrarlo en el titulo del correo electrónico a enviar:
    const separandoNombre = nombre.split(' ');
    const nombreSeparado = separandoNombre[0];

    // Prepara el cuerpo del correo electrónico,
    const mailOptions = {
        to: email,
        from: 'Nautilus',
        template: 'contraseñaActualizada',
        subject: `¡Hola, ${nombreSeparado}! Tu contraseña fue modificada con éxito.`,
        context: {
            nombre: nombre
        }
    };

    // ... y envía el correo electrónico:
    return new Promise (resolve => {
        transporter.sendMail(mailOptions, function(err) {
            // ... Si hay un error al crear un correo electrónico, muestra el error en la petición;
            if (err) {
                resolve({
                    ok: false,
                    header: '¡Auch!',
                    msg: 'Ocurrió un problema al enviar el correo electrónico de notificación de cambio de contraseña.',
                    errors: err
                });
            } else {
                // ... si no hay error, muestra mensaje de éxito en la petición.
                resolve({
                    ok: true,
                    header: '¡Perfecto!',
                    msg: 'Correo enviado correctamente.'
                });
            };
        });
    });
};

// Exportaciones:
module.exports = {
    welcome_Email,
    resetPwd_Email,
    successResetPwdAction_Email
};