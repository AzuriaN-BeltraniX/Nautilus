import { Component, Input } from '@angular/core';
import { DataLocalService } from '../../services/dataLocal.service';
import { ModalController, AlertController } from '@ionic/angular';
import { FileUploadsService } from '../../services/file-uploads.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss'],
})
export class UserImageComponent {

  @Input() imgDir: string;

  // Declarando variables para su reutilización:
  public userImg: string = '';
  public imageToUpload: File;

  constructor(
    private dataLocalService: DataLocalService,
    private modalController: ModalController,
    private alertController: AlertController,
    private fileUploadsService: FileUploadsService
  ) {    
    this.userImg = dataLocalService.imageUrl;
  }

  // Función para actualizar la foto de perfil:
  async actualizarDatos() {
    /** PRUEBA: Imprime en consola un mensaje de correcto funcionamiento. */
    console.log('Funciona actualizarDatos');
    console.log(this.imgDir);

    // Requiere de los siguientes datos para continuar:
    const userID = this.dataLocalService.usuario.userID;

    // Realizando la petición:
    await this.fileUploadsService.actualizarFoto(this.imgDir, 'users', userID);
  }

  // Función para actualizar la foto de perfil:
  async actualizarDatos_1() {
    /** PRUEBA: Imprime en consola un mensaje de correcto funcionamiento. */
    console.log('Funciona actualizarDatos');

    /** BETA: Muestra una alerta de que la función actualimente no está disponible */
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `Una disculpa...`,
      message: 'El servicio de actualización de foto de perfil actualmente no se encuentra disponible, hable con el administrador para más detalles.',
      buttons: ['ok']
    });
    // ... presenta el mensaje creado,
    await alert.present();

    // ... Elimina la imagen tomada del Local Storage,
    this.dataLocalService.eliminarNuevaImagenTmp_Usuario();
    // ... Cierra el modal
    this.modalController.dismiss({
      'dismissed': true
    });    
  };

  // Función para cancelar la operación de actualizar la foto de perfil
  cancelarActualizacion() {
    /** PRUEBA: Imprime en consola un mensaje de correcto funcionamiento. */
    console.log('Funciona cancelarActualizacion');

    // ... Elimina la imagen tomada del Local Storage,
    this.dataLocalService.eliminarNuevaImagenTmp_Usuario();
    // ... Cierra el modal
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
