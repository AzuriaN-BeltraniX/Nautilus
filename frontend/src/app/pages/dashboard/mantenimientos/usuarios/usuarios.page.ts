import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, AlertController, ToastController, IonList } from '@ionic/angular';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../../services/usuario.service';
import { BusquedasService } from '../../../../services/busquedas.service';
import { DataLocalService } from '../../../../services/dataLocal.service';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonList) ionList: IonList;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  public usuarios: Usuario[] = [];
  public totalRegistrados: number = 0;
  private desde: number = 0;
  public completeListener: boolean = false;
  public listenerText: string = '';
  public loading: boolean = true;
  public updateList: boolean = true;
  public loaderText_Card: string = '';

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioService: UsuarioService,
    private dataLocalService: DataLocalService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  // Función para actualizar el listado de usuarios:
  async actualizarListaUsuarios(event) {
    // Elimina los usuarios listados en pantalla, muestra el mensaje de carga
    this.usuarios = [];
    this.completeListener = true;
    this.listenerText = 'Actualizando lista de usuarios registrados...';
    this.desde = 0;
    this.infiniteScroll.disabled = false;

    // Obten los usuarios y realiza las siguientes acciones...
    await this.usuarioService.obtenerUsuarios(this.desde).then(resp => {
      /** PRUEBA: Imprime la respuesta de la petición. */
      // console.log(resp);
      
      // ... Coloca los usuarios en el arreglo "usuarios", e imprímelos en consola:
      this.usuarios = resp['usuarios'];
      // console.log(this.usuarios);
      // ... Extrae el total de usuarios registrados e imprímelo en consola:
      this.totalRegistrados = resp['total'];
      // console.log('Usuarios registrados:', this.totalRegistrados);

      // Valida si la resupuesta es exitosa, si es así entonces elimina el mensaje de carga:
      if (resp['ok'] === true) {
        this.completeListener = false;
        event.target.complete();
      };
    });
  };

  // Función que obtiene los datos de los usuarios listados desde el Backend:
  async obtenerUsuarios() {
    // Rellena los elementos con el texto adecuado para su muestreo en pantalla:
    this.loaderText_Card = 'Cargando usuarios registrados...';

    // Obten los usuarios y realiza las siguientes acciones...
    await this.usuarioService.obtenerUsuarios(this.desde).then(resp => {
      /** PRUEBA: Imprime la respuesta de la petición. */
      // console.log(resp);
      
      // ... Coloca los usuarios en el arreglo "usuarios", e imprímelos en consola:
      this.usuarios = resp['usuarios'];
      // console.log(this.usuarios);
      // ... Extrae el total de usuarios registrados e imprímelo en consola:
      this.totalRegistrados = resp['total'];
      // console.log('Usuarios registrados:', this.totalRegistrados);

      // Valida si la resupuesta es exitosa, si es así entonces elimina el mensaje de carga:
      if (resp['ok'] === true) {
        this.loading = false;
      };
    });
  };

  // Función que recarga más usuarios al cambiar paginado de registros:
  async reloadUsers(valor: number) {
    // Suma el valor enviado, añádelo a "desde", e imprímelo en consola:
    this.desde += valor;
    // console.log(this.desde);

    // Valida si el valor de desde es mayor o igual al número de registros, si es así, entonces ejecuta lo siguiente:
    if (this.desde >= this.totalRegistrados) {
      this.desde -= valor - 10;
      this.infiniteScroll.disabled = true;
      this.completeListener = true;
      this.listenerText = 'Se han mostrado todos los resultados.'
    };

    // Realiza la petición y añade los nuevos resultados al arreglo original de "usuarios":
    await this.usuarioService.obtenerUsuarios(this.desde).then(resp => {
      this.usuarios.push(...resp['usuarios']);
      this.infiniteScroll.complete();
    });
  };

  // Función para editar los datos de usuario desde un Modal:
  async editar(usuario: Usuario) {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('Usuario seleccionado:', usuario);

    // Requiere de los siguientes datos para continuar:
    this.dataLocalService.cargarToken();
    const token = this.dataLocalService.token;

    // Carga los datos del usuario en sesión:
    this.usuarioService.getUserData(token).then(async resp => {
      /** PRUEBA: Imprime al usuario en sesión */
      console.log('Usuario en sesión', resp['user']);
      const userLogged: Usuario = resp['user'];
      
      // Valida la id del usuario a editar, si se esta logueado con esa cuenta, redirigelo a la página de "perfil":
      if (userLogged.userID === usuario.userID) {
        this.router.navigateByUrl('/dashboard/perfil');
        this.ionList.closeSlidingItems();
      } else {
        this.ionList.closeSlidingItems();
    
        const modal = await this.modalController.create({
          component: EditarUsuarioComponent,
          componentProps: { usuario: usuario },
          cssClass: 'my-custom-class'
        });
        await modal.present();

        // Al cerrar el modal, recibe los datos del usuario actualizado:
        const { data } = await modal.onDidDismiss();
        /** PRUEBA: Imprime en consola los datos recibidos. */
        console.log(data);

        // Si existen datos recibidos entonces ejecuta las siguientes acciones:
        if (data) {
          // ... recupera los datos obtenidos del modal,
          const usuarioActualizado = data.itemReturned;
          // ... busca en "usuarios" al usuario recibido mediante su ID y ejecuta lo siguiente:
          const estaEnLista = this.usuarios.find((item) => {
            if (item.userID === usuario.userID) {
              item.nombre = usuarioActualizado.nombre;
              item.email = usuarioActualizado.email;

              return true;
            }
          });

          // Ya con los datos obtnenidos, añade los datos al usuario seleccionado.
          if (!estaEnLista) {
            this.usuarios.push(usuarioActualizado)
          }
        };
      };
    }); 
  };

  // Función para asignar un rol de usuario:
  async asignarRol(user) {
    /** PRUEBA: Imprime en consola el usuario seleccionado. */
    console.log('Cambiando rol de:', user.nombre);
    console.log('>> Datos del usuario:', user);

    if (user.role === 'USER_ROLE') {
      // Muestra una alerta antes de eliminar al usuario:
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: `¿Hacer administrador?`,
        message: `Estas por asignar el rol de administrador a ${user.nombre}.
                  \n Si deseas ejecutar la acción, presiona 'Sí'.`,
        buttons: [
          {
            text: 'Sí',
            cssClass: 'confirm',
            handler: async () => {
              // Agrupa los datos a enviar:
              const data = {nombre: user.nombre, email: user.email, role: 'ADMIN_ROLE'};
              const id = user.userID
              // Realiza la petición:
              this.usuarioService.actualizarPerfil_ext(data, id).then(async (userInfo: Usuario) => {
                /** PRUEBA: Imprime en consola el los datos actualizados del usuario. */
                console.log(userInfo);

                if (userInfo) {
                  // ... muestra una alerta de éxito:
                  const toast = await this.toastController.create({
                    header: `Ahora ${user.nombre} es administrador.`,
                    position: 'bottom'
                  });
                  toast.present();
                  // ... cierra la alerta en 2.5 segundos:
                  setTimeout(() => {
                    this.toastController.dismiss();
                  }, 2500);

                  // Cierra el sliding:
                  this.ionList.closeSlidingItems();
                }
              });
            }
          }, {
            text: 'Cancelar',
            cssClass: 'cancel',
            handler: () => {
              /** PRUEBA: Muestra mensaje en consola de la acción a realizar, */
              console.log('Operación cancelada');

              // Cierra el sliding:
              this.ionList.closeSlidingItems();
            }
          }
        ]
      });
      // ... presenta el mensaje creado.
      await alert.present();
    } else {
      // Muestra una alerta antes de eliminar al usuario:
      const alert = await this.alertController.create({
        backdropDismiss: false,
        header: `¿Revocar permiso de administrador?`,
        message: `Estas por revocar el rol de administrador a ${user.nombre}, si deseas ejecutar la acción, presiona 'Sí'.`,
        buttons: [
          {
            text: 'Sí',
            cssClass: 'delete',
            handler: async () => {
              // Agrupa los datos a enviar:
              const data = {nombre: user.nombre, email: user.email, role: 'USER_ROLE'};
              const id = user.userID
              // Realiza la petición:
              this.usuarioService.actualizarPerfil_ext(data, id).then(async (userInfo: Usuario) => {
                /** PRUEBA: Imprime en consola el los datos actualizados del usuario. */
                console.log(userInfo);

                if (userInfo) {
                  // ... muestra una alerta de éxito:
                  const toast = await this.toastController.create({
                    header: `${user.nombre} ya no es administrador.`,
                    position: 'bottom'
                  });
                  toast.present();
                  // ... cierra la alerta en 2.5 segundos:
                  setTimeout(() => {
                    this.toastController.dismiss();
                  }, 2500);

                  // Cierra el sliding:
                  this.ionList.closeSlidingItems();
                }
              });
            }
          }, {
            text: 'Cancelar',
            cssClass: 'cancel',
            handler: () => {
              /** PRUEBA: Muestra mensaje en consola de la acción a realizar, */
              console.log('Operación cancelada');
              // Cierra el sliding:
              this.ionList.closeSlidingItems();
            }
          }
        ]
      });
      // ... presenta el mensaje creado.
      await alert.present();
    }
  };

  // Función para eliminar a un usuario:
  async eliminar(usuario: Usuario) {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento y valor que se recibe. */
    // console.log('Funciona Eliminar Usuario');
    console.log('Usuario seleccionado:', usuario);

    // Requiere de los siguientes datos para continuar:
    this.dataLocalService.cargarToken();
    const token = this.dataLocalService.token;
    
    // Carga los datos del usuario en sesión:
    this.usuarioService.getUserData(token).then(async resp => {
      /** PRUEBA: Imprime al usuario en sesión */
      console.log('Usuario en sesión', resp['user']);
      const userLogged: Usuario = resp['user'];
      
      // Valida la id del usuario a eliminar, si se esta logueado con esa cuenta, no ejecutes la función:
      if (userLogged.userID === usuario.userID) {
        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: 'No puedes eliminarte a ti mismo...',
          message: 'Solicita la eliminación de tu cuenta a otro administrador.'
        });
        await alert.present();
        setTimeout(() => {
          this.alertController.dismiss();
        }, 5000);
      } else {
        // Muestra una alerta antes de eliminar al usuario:
        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: `¿Seguro?`,
          message: `Estas por eliminar a ${usuario.nombre}, si deseas ejecutar la acción, presiona Eliminar.`,
          buttons: [
            {
              text: 'Eliminar',
              cssClass: 'delete',
              handler: async () => {
                // Realizando la petición;
                await this.usuarioService.eliminarUsuario(usuario.userID).then(async resp => {
                  // ... muestra la respuesta de la petición mediante un toast dependiendo de la siguiente validación,
                  if (resp['ok'] === true) {
                    // ... muestra una alerta de éxito:
                    const toast = await this.toastController.create({
                      header: resp['header'],
                      position: 'bottom'
                    });
                    toast.present();
                    // ... cierra la alerta en 2.5 segundos:
                    setTimeout(() => {
                      this.toastController.dismiss();
                    }, 2500);

                    // ...borra al usuario eliminado de la lista de usuarios mostrados y,
                    const usuarioSelec = this.usuarios.findIndex(user => user.userID === usuario.userID);
                    this.usuarios.splice(usuarioSelec, 1);

                    // ... cierra el sliding.
                    this.ionList.closeSlidingItems();
                  } else {
                    // ...Si no se pudo eliminar al usuario, muestra toast con el mensaje de error y,
                    const toast = await this.toastController.create({
                      message: resp['msg'],
                      position: 'bottom'
                    });
                    toast.present();
                    // ... cierra la alerta en 2.5 segundos:
                    setTimeout(() => {
                      this.toastController.dismiss();
                    }, 5000);

                    // ... cierra el sliding:
                    this.ionList.closeSlidingItems();
                  };
                });
              }
            }, {
              text: 'Cancelar',
              cssClass: 'cancel',
              handler: () => {
                /** PRUEBA: Muestra mensaje en consola de la acción a realizar, */
                console.log('Operación cancelada');
                // Cierra el sliding:
                this.ionList.closeSlidingItems();
              }
            }
          ]
        });
        // ... presenta el mensaje creado.
        await alert.present();
      };
    }); 
  };

  // Función para relizar una búsqueda de usuarios dependiendo de lo que escriba el usuario en la barra:
  async busqueda(event) {
    /** PRUEBA: Imprime en consola la letra que escribe el usuario */
    // console.log(event);
    // console.log(event.detail.value);

    // Antes de que se realize la búsqueda, muestra la tarjeta de carga y elimina los usuarios listados:
    this.usuarios = [];
    this.loading = true;
    this.loaderText_Card = 'Buscando usuarios...'
    this.completeListener = false;
    this.infiniteScroll.disabled = false;

    // Si el usuario borró por completo los caracteres del campo de búsqueda, entonces carga de nuevo los usuarios
    if (event.detail.value === '') {
      this.desde = 0;
      this.obtenerUsuarios();
      this.completeListener = false;
    };
    
    // Valida el campo de búsqueda, si está vacío, entonces muestra un mensaje instructivo
    if (event.detail.value === undefined) {
      return console.log('Escribe una letra para buscar uno o más usuarios con letra semejante.');   
    };

    // Realiza la petición: 
    await this.busquedasService.busqueda_Coleccion(event.detail.value, 'users').then((results: []) => {
      /** Imprime en consola los resultados de búsqueda. */
      // console.log(results);

      // Si no hay un resultado con el valor de búsqueda sugerido, entonces muestra el siguiente mensaje:
      if (results.length === 0) {
        this.loading = false;
        this.completeListener = true;
        this.listenerText = 'No hay resultados con el criterio de búsqueda solicitado.'
      } else if (results.length > 0) {
        this.loading = false;
        this.usuarios = results;
      };
    });
  };

}
