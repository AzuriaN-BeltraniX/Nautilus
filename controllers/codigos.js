/**
 *  Controlador para enviar banderas booleanas y así ejecutar funciones:
 *      - Buscar y validar la existenca un código ingresado,
 *      - Registrar un código generado.
*/

// Importaciones:
const { request, response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

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

// Controlador para generar un nuevo código:
const generarCodigo = (min, max) => {
    // Genera el código numérico:
    const code = Math.floor(Math.random() * (max - min) + min);

    // Promesa:
    return new Promise (resolve => {
        resolve(code);
    });
};

// Controlador para buscar validar la existencia de código ingresado:
const validarCodigo = async(req = request, res = response) => {
    // Captura el código ingresado del BODY:
    const code = req.body.code;
    
    try {
        // Busca en la base de datos el documento que contenga el código ingresado:
        Usuario.findOne({tmpCode: code}, async (err, usuarioDB) => {
            /** PRUEBA: Imprime en consola la data recibida. */
            // console.log(usuarioDB || 'No se encontró al usuario con el código ingresado...');

            // ... Si el codigo ingresado no existe, entonces retorna mensaje de error en la respuesta,
            if (!usuarioDB) {
                console.log(err);
                return res.status(406).json({
                    ok: false,
                    header: 'Codigo no es válido, revisa que esté correctamente escrito el código que recibiste.',
                });
            // ... si existe el código ingresado en la base de datos, realiza lo siguiente;
            } else {
                // ... genera un token y muéstralo en la respuesta de la petición:
                const token = await generarJWT({
                    userID: usuarioDB._id,
                    key: process.env.VALID_SPECIALTOKEN
                }, 300); // Expira en 5 minutos.

                return res.status(202).json({
                    ok: true,
                    header: '¡Código validado exitosamente!',
                    token: token
                });
            };
        });
    } catch (error) { // Si no se puede la validación del código, entonces...
        console.log(error); // Imprime el error
        res.status(500).json({
            ok: false,
            header: 'Esto no debería pasar...',
            msg: 'Reporte este error al administrador.'
        }); // Retorna el mensaje de error.
    }

    // ... genera el token almacenando en Payload el los datos del usuario extraído
};

// Controlador para registrar un nuevo código:
const registrarCodigo = async(code, userID) => {
    // Busca en la base de datos una ID de usuario asociado:
    const usuario = await Usuario.findById(userID);

    // Promesa:
    return new Promise ((resolve, reject) => {
        // Valida la existencia de el ID de Usuario y realiza las siguientes acciones:
        if (!usuario) {
            reject(false);
        } else {
            // ... lista los usuarios con el código ingresado y realiza las siguientes acciones;
            Usuario.find({tmpCode: code}, async (err, usuarios) => {
                /** PRUEBA: Imprime en consola los usuarios encontrados con el mismo código. */
                // console.log(usuarios);

                // ... si existe más de un usuario con el mismo código, entonces genera otro y almacénalo:
                if (usuarios.length > 0) {
                    /** PRUEBA: Imprime mensaje sobre la coincidencia. */
                    console.log('>! (ERROR) - Hay mas de un usuario con el mismo código.');

                    await generarCodigo(1000, 9999).then(code => {
                        /** PRUEBA: Imprime en consola el nuevo código generado. */
                        console.log('>>> Nuevo código generado:', code);


                        // ... una vez generado el código, busca al usuario encontrado mediate ID y haz lo siguiente:
                        Usuario.findById(userID, (err, usuarioDB) => {
                            // ... si no existe el usuario, muestra error en consola,
                            if (!usuarioDB) {
                                console.log('No existe el usuario, reporta este inconveniente al administrador.', err);
                                reject(false);
                            // ... si existe el usuario entonces configura el correo a enviar con el nuevo código generado,
                            } else {
                                const mailOptions = {
                                    to: usuarioDB.email,
                                    form: 'Nautilus',
                                    template: 'resetPwd',
                                    subject: 'Reestablece tu contraseña de tu cuenta en Nautilus.',
                                    context: {
                                        code: code,
                                        nombre: usuarioDB.nombre
                                    }
                                };
                                // ... envía el correo electrónico, y ejecuta las siguientes acciones:
                                transporter.sendMail(mailOptions, function(err) {
                                    // ... Si hay un error al crear un correo electrónico, muestra el error en la petición;
                                    if (err) {
                                        console.log('Ocurrió un problema al enviar el correo electrónico de reestablecimiento de contraseña.', err);
                                    } else {
                                        // ... si no hay error, muestra mensaje de éxito en la petición.
                                        console.log('>>> Correo con el nuevo código generado enviado correctamente.');
    
                                        usuarioDB.tmpCode = code;
                                        usuarioDB.save();
                
                                        resolve(false);
                                    };
                                });
                            };
                        });
                    });

                // ... si no, entonces guarda ese código en el usuario solicitado:
                } else {
                    usuario.tmpCode = code;
                    usuario.save();
                    resolve(true);
                };
            });
        };
    });
};

// Exportaciones:
module.exports = {
    generarCodigo,
    validarCodigo,
    registrarCodigo
}