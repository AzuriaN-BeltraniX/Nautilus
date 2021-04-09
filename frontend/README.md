# **FrontEnd: _"nautilusApp"_:**

**_Aplicación PWA y nativa desarrollada en Ionic CLI 6.12.2 para consumir "nautilusApi"._**

* **Ejecuta** el siguiente código para instalar los módulos de NodeJS.
```
    npm install
```

### Contenido:

* ## **v0.1.0 - _"Dashboard Básico":_**
    * Estructuración básica de la aplicación, (_diseño por predeterminado_), incluye:
        * Página de bienvenida.
        * Página de inicio de sesión.
        * Página de registro.
        * Página de *Dashboard*:
            * _Insertado del Menú del Dashboard._
            * _PopoverCard para visualizar:_ 
                * _Los datos básicos del usuario._
                * _Un botón de cerrar sesión._
    * Naveación entre páginas.

    #### _"Validaciones a la Página de Registro":_

    * Validación del nombre de usuario:
        * _Mínimo 3 carácteres._
    * Validación del correo electónico:
        * _Debe incluir el símbolo "@"._
    * Validación de la contraseña:
        * _Debe inluir mínimo 8 carácteres._
    * Validación de confirmación de la contraseña:
        * _Debe incluir mínimo 8 carácteres._
        * _Debe coincidir con la contraseña ingresada anteriormente_
    * Validación de aceptación de los términos y condiciones:
        * _"Palomear" la opción **Acepto términos y condiciones**._

    #### _"Conexión al API":_
    
    * Creación del archivo de servicios: _"usuario.service"._
    * Creación del archivo las interfaces de los formularios; _"auth.interface",_ incluye
        * _Interface de inicio de sesión._
        * _Interface del registro de usuarios._
        * _Interface de la respuesta al iniciar sesión._
    * Instalación del paquete _**"cordova-sqlite-storage"**_, para almacenar datos en el _Local Storage_ del dispositivo.
    * Instalación del paquete _**"ionic-storage"**_, para ejecutar las funciones de guardar datos en el _Local Storage_ del dispositivo. 
    * Desarrollo de la función **"Registrar Usuarios"**, desde la página de registro, este desarrollo incluye:
        * _Registro de un nuevo usuario desde la aplicación._
        * _Almacenamiento del TOKEN y los Datos del Usuario en el **Local Storage** del dispositivo al iniciar sesión después de su registro._
        * _Mostrar una alerta de bienvenida al nuevo usuario registrado._
        * _Redirección al **"Dashboard"**, después de haber concluido con las funciones anteriores._
    * Desarrollo de la función **"Iniciar sesión"**, desde la página de inicio de sesión, este desarrollo inlcuye:
        * _Inicio de sesión de un usuario existente, es decir, ya registrado._
        * _Almacenamiento del TOKEN y los Datos del Usuario en el **Local Storage** del dispositivo al iniciar sesión._
        * Redirección al _"Dashboard", después de haber concluido con las funciones anteriores._
    * Desarrollo de la función **"Hello, again"**, para que al detectar un usuario almacenado en el Local Storage, muestre un diseño diferente en la página de incio de sesión. Así solo sea necesario colocar la contraseña para iniciar sesión.
    
    #### _"AuthGuard y Local Storage":_
    
    * Creación del **authGuard**, que impide ingresar al "Dashboard" si no existe un token:
        * Requiere del _TOKEN_ almacenado en el Local Storage.
    * Desarrollo del servicio de almacenado y cargado para datos en el Local Storage _**"dataLocal_service"**_, este incluye:
        * Carga y almacenado del _TOKEN_ al inciar sesión
        * Carga y almacenado de los datos del usuario extraidos desde el _TOKEN_.
    * Desarrollo del **authGuard**, incluye:
        * Verificación del usuario logueado, usando un servicio desde el Backend, con ayuda del TOKEN generado al iniciar sesión.
    * Modificación de la función **"Hello, again"**, para que los datos los obtenga del usuario desde _**"dataLocal_service"**_.
    
    #### _"Datos del usuario"_:
    
    * Creación de la _Página de perfil del usuario_, incluye las funciones de:
        * Actualización del nombre de usuario.
        * Actualización del correo del usuario.
        * Actualización de imagen de perfi. _(**Pediente**)_
    
    #### _"Mantenimiento de Usuarios"_:
    * Creación de la página "Mantenimiento de Usuarios", para el manejo de los usuarios registrados en la aplicación, incluye las funciones de:
        * Listado de todos los usuarios registrados.
        * Editado de los datos del usuario:
            * Cambio de nombre de cualquier usuario.
            * Cambio de correo de cualquier usuario.
            * Cambio de imagen de perfil de cualquier usuario. _(**Pediente**)_
            * Asignación o revocación de rol de administador.
        * Eliminación de cualquier usuario.
        * Búsqueda de usuarios automática desde que se escribe.
        
    #### _"Mantenimiento de Médicos"_:
    * Creación de la página "Mantenimiento de Médicos", para el manejo de los medicos registrados en la aplicación, incluye las funciones de:
        * Registro de un nuevo médico. _(**Pediente**)_
        * Listado de todos los medicos registrados.
        * Editado de los datos del medico:
            * Cambio de nombre de cualquier medico.
            * Cambio de imagen de perfil de cualquier medico. _(**Pediente**)_
        * Eliminación de cualquier medico.
        * Búsqueda de médicos automática desde que se escribe.