import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { UsuarioService } from '../../services/usuario.service'; // Servicio de CRUD de usuarios
import { RespLogin } from '../../interfaces/auth.interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  // Declarando variables para su reutilización:
  tryLogin: boolean = false;

  // Declaración del formulario que muestra si fue enviado o no:
  public formSubmitted = false;

  // Datos del formulario con validaciones
  public registerForm = this.formBuilder.group({
    nombre: ['Isaac Bonilla', [Validators.required, Validators.minLength(3)]],
    email: ['jibv15@outlook.com', [Validators.required, Validators.email]],
    password: ['JolyPato_3729', [Validators.required, Validators.minLength(8)]],
    password2: ['JolyPato_3729', [Validators.required, Validators.minLength(8)]],
    terminos: [true, Validators.required]
  }, {
    // Valida las contraseñas idénticas antes de enviar el formulario
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService
  ) { }

  // Registrando un usuario:
  crearUsuario() {
    /** PRUEBA: Imprime los datos del formulario a enviar. */ 
    console.log(this.registerForm.value); 
    
    // Declaraciones a TRUE:
    this.formSubmitted = true;
    this.tryLogin = true;

    // VALIDACIÓN: Si el formulario no es válido, entonnces:
    if (this.registerForm.invalid) {
      // ... retorna mensaje en consola
      return console.log('Formulario inválido');
    }

    this.usuarioService.crearUsuario(this.registerForm.value).then(async (resp: RespLogin) => {
      /** PRUEBA: Imprime en consola la respuesta de la petición. */
      console.log(resp);

      if (resp.ok === true) {
        /** PRUEBA: Imprime mensaje de éxito al iniciar sesión, incluyendo el nombre de usuario. */
        console.log(`Cuenta registrada: \n\n  · Haz iniciado sesión como: "${resp.usuario.nombre}".`);
        this.tryLogin = false;

        // ... crea el mensaje de éxito,
        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: `¡Bienvenido ${resp.usuario.nombre}!`,
          message: 'Se te ha registrado correctamente, disfruta de la aplicación.',
          buttons: ['Gracias']
        });
        // ... presenta el mensaje creado,
        await alert.present();
        // ... y redirije al 'DAHSBOARD'.
        this.router.navigateByUrl('/dashboard');
      } else {
        /** PRUEBA: Imprime en consola la afirmación. */
        console.warn('No se pudo registrar al nuevo usuario...');

        // ... crea el mensaje de éxito,
        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: `¡Hey!`,
          message: resp.msg,
          buttons: ['Adelante']
        });
        // ... y presenta el mensaje creado
        await alert.present();
      }
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passNoCoincide() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }    
  }

  passwordsIguales(passName1: string, passName2: string) {
    return (formGroup: FormGroup) => {
      const pass1Ctrl = formGroup.get(passName1);
      const pass2Ctrl = formGroup.get(passName2);

      if (pass1Ctrl.value === pass2Ctrl.value) {
        pass2Ctrl.setErrors(null)
      } else {
        pass2Ctrl.setErrors({noEsIgual: true})
      }
    }
  }

}
