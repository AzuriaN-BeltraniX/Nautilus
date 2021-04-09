/**
 *  Controlador para:
 *      - Subir imágenes, asignándolo a un usuario registrado,
 *      - Mostrar las imágenes regitradas a un usuario desde la base de datos.
*/

// Importaciones
const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizarImagen');

// Controlador para subir archivos, específicamente una imagen, asignándolo a un usuario:
const fileUpload = (req, res = response) => {
    // Subiendo archivos:
    const tipo = req.params.tipo; // Requiere de la colección para encontrar al usuario
    const id = req.params.id; // Requiere la ID de usuario

    const termino = tipo; // Captura el término ingresado
    
    // Si existen los términos antieriores, entonces:
    const tiposValidos = ['users', 'medicos', 'pacientes', 'almacenes', 'productos']; // Define las colecciones válidas...
    // ... Si no se incluye una colección válida, entonces...
    if (!tiposValidos.includes(tipo)) {
        return res.status(406).json({ // Muestra estado de la petición
            ok: false,
            msg: `El término "${termino}", no es válido o no existe. Los términos válidos son: 'users', 'medicos', 'pacientes'.`
        }); // Retorna mensaje de error...
    }
    // ... Pero, si no hay un archivo cargado, entonces...
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ // Muestra el estado de la petición
            ok: false,
            header: '¡Hey!',
            msg: 'No hay ninguna imagen cargada.'
        }); // Retorna mensaje de error
    }

    // Si todo se ha validado bien, entonces procesa la imagen:
    const file = req.files.image; // Requiere de una imagen seleccionada
    // ... Extreae el formato del archivo:
    const nombreCortado = file.name.split('.'); // Divide el nombre del archivo en un arreglo
    const extArchivo = nombreCortado[nombreCortado.length - 1]; // Extrae el formato del archivo
    // ... Valida la extención extraída
    const extValidas = ['png', 'jpg', 'jpeg', 'gif']; // :extenciones válidas
    // ... Si la extención del archivo no coincide con las extenciones válidas, entonces...
    if (!extValidas.includes(extArchivo)) { 
        return res.status(406).json({ // Muestra el estado de la petición
            ok: false,
            msg: 'La extención del archivo que intentas subir no está permitida.'
        }); // Retorna mensaje de error
    }
    // ... Si todo se ha validado bien, entonces genera un nombre de archivo:
    const nomArchivo = `${uuidv4()}.${extArchivo}`;
    // ...Una vez generado el nombre de archivo, guarda la imagen en la Base de Datos
    const path = `./uploads/${tipo}/${nomArchivo}`; // Define la ruta donde se ubicará la imagen
    file.mv(path, (err) => { // Guarda la imagen
        if (err) { // Si hay un error al guardar la imagen, entonces...
            console.log(err); // Imprime el error
            return res.status(500).json({
                ok: false,
                header: 'Esto no debería pasar...',
                msg: 'No se pudo subir la imagen, por favor reporte este error al administrador.'
            }); // Retorna el mensaje de error
        }

        // Actualizando la base de datos
        actualizarImagen(tipo, id, nomArchivo);

        // Si no hubo error entonces muestra mensaje de éxito:
        res.json({
            ok: true,
            msg: 'Archivo subido exitosamente',
            // 'Nombre del archivo': nomArchivo
            nomArchivo
        });
    });
}

// Controlador para mostrar archivos de un usuario:
const muestraImagen = (req, res = response) => {
    // Mostrando las imagenes
    const tipo = req.params.tipo; // Requiere de la colección para encontrar al usuario
    const img = req.params.img; // Requiere la imagen de usuario

    // ... Captura la ruta específica de la imagen deseada a mostrar
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${img}`);

    // ... Si existe una imagen personalizada, entonces:
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else { // Si no existe una imagen personalizada, entonces...
        const pathImg = path.join(__dirname, `../uploads/img_avatar.png`);
        res.sendFile(pathImg); // Muestra la imagen por defecto.
    }
}

// Exportaciones
module.exports = {
    fileUpload,
    muestraImagen
}