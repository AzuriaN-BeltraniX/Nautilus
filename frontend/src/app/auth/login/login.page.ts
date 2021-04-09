import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Usuario } from '../../models/usuario.model';
import { RespLogin } from '../../interfaces/auth.interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { DataLocalService } from '../../services/dataLocal.service';
import { ActionsService } from '../../services/actions.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  // Declarando variables para su reutilización:
  usuario: Usuario;
  userImg: string = '';
  formRecent: boolean = false;
  tryLogin: boolean = false;

  public recentLoginForm: any;
  public loginForm = this.formBuilder.group({
    email: ['jibv3729@outlook.com', [Validators.required, Validators.email]],
    password: ['JolyPato_3729', [Validators.required, Validators.minLength(8)]]
  });
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storage: Storage,
    private alertController: AlertController,
    private modalController: ModalController,
    private usuarioService: UsuarioService,
    public dataLocalService: DataLocalService,
    private actionsService: ActionsService) 
  { 
    // Verifica si hay un usuario en el local Storage
    this.existeUsuario();
  }

  // Función para cambiar de usuario si es que un usuario ya está registrado en el Local Storage:
  changeUser() {
    /** PRUEBA: Verifica el funcionamiento del botón a ejecutar, mostrando un mensaje */
    // console.log('Funciona cambiar de usuario.');
    
    this.formRecent = false;

    if (this.formRecent === false) {
      this.formRecent = false;
      this.storage.remove('usuario');
    } else {
      this.existeUsuario();
    }
  };

  // Función que verifica si existe un usuario guardado en el Local Storage:
  existeUsuario() {
    this.dataLocalService.cargarUsuario_Promise().then(result => {
      /** PRUEBA: Imprime el booleano retornado de la promesa. */
      console.log('> ¿Existe un usuario almacenado?:', result);

      // Si existe un usuario almacenado, construye el formulario correspondiente:
      if (result === true) {
        this.formRecent = true;
        // Muestra la imaen de usuario en el Login
        this.userImg = this.usuarioService.getUserImage();

        this.recentLoginForm = this.formBuilder.group({
          email: [this.dataLocalService.usuario.email, [Validators.required, Validators.email]],
          // email: ['', [Validators.required, Validators.email]],
          password: ['JolyPato_3729', [Validators.required, Validators.minLength(8)]]
        });
      } 
    });
  };

  // Función para iniciar sesión, si el formulario es valido;
  async login() {
    /** PRUEBA: Imprime los datos del formulario a enviar. */
    console.log(`Iniciando sesión... \n\n  · Formlogin a enviar:`, this.loginForm.value);
    this.tryLogin = true;

    if (this.formRecent === false) {
      // Enviando petición POST, obteniendo el URL del archivo de servicios;
      await this.usuarioService.login(this.loginForm.value).then(async (resp: RespLogin) => {
        /** PRUEBA: Imprime la respuesta del backend al iniciar sesión. */
        console.log(resp);
        
        // Si el inicio de sesión es exitoso, entonces;
        if (resp['ok'] === true) {
          /** PRUEBA: Imprime mensaje de éxito al iniciar sesión, incluyendo el nombre de usuario. */
          console.log(`Sesión iniciada: \n\n  · Haz iniciado sesión como: "${resp.usuario.nombre}".`);
          this.tryLogin = false;

          // ... crea el mensaje de éxito,
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: `¡Bienvenido ${resp.usuario.nombre}!`,
            message: 'Haz iniciado sesión con éxito.',
            buttons: ['Adelante']
          });
          // ... presenta el mensaje creado,
          await alert.present();
          // ... y redirije al 'DAHSBOARD'.
          this.router.navigateByUrl('/dashboard');
        // ... si no, entonces:
        } else {
          /** PRUEBA: Imprime en consola la afirmación. */
          console.warn('No se pudo iniciar sesión...');
          this.tryLogin = false;
          
          // ... crea el mensaje de éxito,
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: `¡Hey!`,
            message: resp.msg,
            buttons: ['Adelante']
          });
          // ... y presenta el mensaje creado
          await alert.present();
        };
      });
    } else {
      // Enviando petición POST, obteniendo el URL del archivo de servicios;
      await this.usuarioService.login(this.recentLoginForm.value).then(async (resp: RespLogin) => {
        /** PRUEBA: Imprime la respuesta del backend al iniciar sesión. */
        console.log(resp);
        
        // Si el inicio de sesión es exitoso, entonces;
        if (resp['ok'] === true) {
          /** PRUEBA: Imprime mensaje de éxito al iniciar sesión, incluyendo el nombre de usuario. */
          console.log(`Sesión iniciada: \n\n  · Haz vuelto a iniciar sesión como: "${resp.usuario.nombre}".`);
          this.tryLogin = false;

          // ... crea el mensaje de éxito,
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: `¡Bienvenido de nuevo, ${resp.usuario.nombre}!`,
            message: 'Haz iniciado sesión con éxito.',
            buttons: ['Adelante']
          });
          // ... presenta el mensaje creado,
          await alert.present();
          // ... y redirije al 'DAHSBOARD'.
          this.router.navigateByUrl('/dashboard');
        } else {
          /** PRUEBA: Imprime en consola la afirmación. */
          console.warn('No se pudo iniciar sesión...');
          this.tryLogin = false;
          
          // ... crea el mensaje de éxito,
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: `¡Hey!`,
            message: resp.msg,
            buttons: ['Adelante']
          });
          // ... y presenta el mensaje creado
          await alert.present();
        };
      });
    }
  };

  // Función para abrir el modal para el envio del correo electrónico del recuperación de contraseña.
  async resetPwd() {
      const modal = await this.modalController.create({
        component: '',
        cssClass: 'my-custom-class'
      });
      
      return await modal.present();
  };

}
