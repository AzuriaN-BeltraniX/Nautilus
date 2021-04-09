import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { Usuario } from '../../../../../models/usuario.model';
import { DataLocalService } from '../../../../../services/dataLocal.service';
import { UsuarioService } from '../../../../../services/usuario.service';
import { UserImageComponent } from '../../../../../components/user-image/user-image.component';
import { HardwarecontrollerService } from '../../../../../services/hardware-controller.service';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
})
export class EditarUsuarioComponent implements OnInit {

  @Input() usuario: Usuario;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  public userRole: string = 'USER_ROLE';
  public userRoleStyle: string = 'avatarBtn'

  // Declarando el formulario para las peticiones:
  public userData: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private hardwarecontrollerService: HardwarecontrollerService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    // Valida si el usuario seleccionado es administrador:
    if (this.usuario.role === 'ADMIN_ROLE') {
      this.userRoleStyle = 'avatarBtn_Admin';
    }

    console.log(this.usuario);
    

    this.userData = this.formBuilder.group({
      nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  // Función que cierra el modal:
  async cerrarModal(){
    // ... Si el usuario decide cancelar el procedimiento, muestra una alerta,
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `¡Hey!`,
      message: 'No se han guardado los cambios. ¿Quieres continuar?.',
      buttons: [
        {
          text: 'Sí',
          cssClass: 'confirm',
          handler: () => {
            this.modalController.dismiss({
              'dismissed': true
            });
          }
        },
        {
          text: 'No',
          cssClass: 'cancel'
        }
      ]
    });
    // ... presenta el mensaje creado
    await alert.present();
  };

  // Actualiza los datos del usuario:
  actualizarDatos() {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('Funciona Actualizar Usuario');
    console.log(this.userData.value);

    // Requiere de los siguientes datos para continuar:
    const data = {nombre: this.userData.value.nombre, email: this.userData.value.email, role: this.usuario.role};
    const id = this.usuario.userID;

    // Realiza la petición:
    this.usuarioService.actualizarPerfil_ext(data, id).then(async userData => {
      /** PRUEBA: Imprime los datos actualizados del usuario. */
      console.log(userData);

      // Si existen datos en la respuesta de la petición, presenta mensaje en pantalla y cierra el modal:
      if (userData) {
        const toast = await this.toastController.create({
          header: `Se ha actualizado el usuario correctamente`,
          position: 'bottom'
        });
        toast.present();
        // ... cierra la alerta en 2.5 segundos:
        setTimeout(() => {
          this.toastController.dismiss();
        }, 5000);

        this.modalController.dismiss({
          itemReturned: userData
        });
      };
    });


  };

  // Función que despliega opciones para cambiar la imagen
  async changeProperties() {
    /** PRUEBA: Imprime en consola un mensaje de funcionamiento exitoso.  */
    console.log('Cambiando las propiedades');

    const actionSheet = await this.actionSheetController.create({
      header: 'Escoge una acción:',
      buttons: [{
        text: 'Cambiar imagen desde cámara',
        icon: 'camera-outline',
        handler: () => {
          console.log('Camara en función');

          this.hardwarecontrollerService.openCamera();
        }
      }, {
        text: 'Cambiar imagen desde galería',
        icon: 'image-outline',
        handler: () => {
          console.log('Galería abierta');

          this.hardwarecontrollerService.openGalery();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancelado');
        }
      }]
    });
    await actionSheet.present();
  };

}
