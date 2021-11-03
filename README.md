# **Proyecto: Nautilus**

**_Aplicacion multiplataforma para la gestion de distintos giros comerciales_**

 ## Descripcion:
Proyecto Nautilus contiene una aplicacion cliente-servidor del tipo MVC(model-view-controller) via http y consta de dos partes:

* **_servidor backend desarrolado en Node.JS v14.4.0 y MongoDB_**
* **_cliente frontend desarrollado con Ionic Framework_** 


El servidor-backend node esta alojado en la carpeta raiz, y el cliente-frontend Ionic reside en la carpeta "frontend"

El directorio "/www" contiene el cliente compilado (Ionic build) y es la carpeta raiz al navegar a la url del proyecto.

El directorio "/public" contiene una página informativa que se muestra al ingresar al environment activo.

Descripcion mas detallada disponible en futuras versiones, o [contácteme aqui](azbel.apps@gmail.com).

---

* ## Instalacion:
Ejecutar desde carpeta raiz
```
    npm install
```

---

* ## **v1.0.0 - _"Sistema básico":_**
    * Incluye:
        * Sistema de Usuarios:
            * _Registro de usuarios._
            * _Inicio de sesión._
            * _Actualización de datos de perfil._
        * Sistema de Médicos:
            * _Registro de Médicos._
            * _Actualización de datos del Médico._
        * Sistema de Pacientes:
            * _Registro de pacientes dependiendo de algún médico ya registrado._
            * _Actualización de datos del paciente._
        * Generación de Tokens (JWT).
        * Sistema de Rutas para peticiones HTTP.
        * Sistema de subida de archivos:
            * _Acepta archivos de imagen: **jpg, jpeg, png, gif.**_
            * _Ruta para visualizar las imágenes subidas mediante una URL._
        * Sistema de mantenimiento de Usuarios:
            * _Actualiza datos, incluyendo imágenes de los usuarios registrados._
            * _Eliminación de usuarios registrados en la aplicación._
            * _Proporcionar privilegios de Administrador o Usuario Estandar._
        * Sistema de mantenimiento de Médicos:
            * _Actualiza datos, incluyendo imágenes de los médicos registrados._
            * _Eliminación de médicos registrados en la aplicación._
        * Sistema de mantenimiento de Pacientes:
            * _Actualiza datos, incluyendo imágenes de los pacientes registrados._
            * _Eliminación de pacientes registrados en la aplicación._

* ## **v2.0.0 - _"Nuevos sistemas añadidos":_**
    * Incluye:
        * Sistema de Almacenes y Productos:
            * _Registro de Almacenes y Productos._
            * _Actualización de datos de Almacenes y Productos registrados._
        * Sistema de mantenimientos de Almacenes y Productos:
            * _Actualiza datos, incluyendo imágenes de los almacenes y/o productos registrados._
            * _Eliminación de almacenes o productos registrados en la aplicación._
        * _Templates_ para su envío mediante el sistema de envíos de correo electrónico.
        * Sistema de envíos de correo electrónico con las siguientes características:
            * _Correos de bienvenida_
            * _Correos de reestablecimiento de contraseñas_
            * _Correos de notificación sobre acciones realizadas en un perfil_
        * Adición de una página principal donde se informa de un desarrollo de una interfaz para manejar todos los sistemas ya mencionados.

* ## **v2.0.1 - _"Modificaciones y actualizaciones":_**
    * Incluye:
        * Modificación de algunos mensajes de respuesta a peticiones HTTP que recibe el usuario y/o desarrollador al realizar acciones dentro del API.
        * Arreglo de algunos detalles en la función que valida algún usuario que requiera validación de sus datos.
        * Arrelgo estético a la página informativa que se muestra al entrar a la página alojada donde corre este servidor.
        * Actualización de librerías a su verisión mas reciente del día 2 de noviembre de 2021.

* ## **v2.0.2 - _"Solución a errores por actualización de librerías":_**
    * Incluye:
        * Modificación y actualización de algunas líneas de código que solucionan algunos errores surgidos por la actualización de las librerías en la versión anterior.

* ## **v2.0.3 - _"Páginas de confirmación":_**
    * Incluye:
        * Adición de página que informa del correcto funcionamiento de los servicios de NautilusApi en [la página de alojamiento](www.azbelnix.xyz/api).

---

> **NautilusApi** by AzuriaN BeltraniX 2020 - 2021
> **Nautilus** by AzuriaN BeltraniX 2020 - 2021
