import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ActionSheetController, ToastController } from '@ionic/angular';

import { Medico } from 'src/app/models/medico.model';
import { environment } from 'src/environments/environment';
import { HardwarecontrollerService } from '../../../../../services/hardware-controller.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MedicoService } from '../../../../../services/medico.service';

@Component({
  selector: 'app-editar-medico',
  templateUrl: './editar-medico.component.html',
  styleUrls: ['./editar-medico.component.scss'],
})
export class EditarMedicoComponent implements OnInit {

  @Input() medico: Medico;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  // Declarando el formulario para las peticiones:
  public doctorData: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private medicoService: MedicoService,
    private hardwarecontrollerService: HardwarecontrollerService
  ) { }

  ngOnInit() {
    // Construyendo el formulario
    this.doctorData = this.formBuilder.group({
      nombre: [this.medico.nombre, [Validators.required, Validators.minLength(3)]]
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

  // Función para actualizar los datos del médico:
  actualizarDatos() {
    /** PRUEBA: Imprime en consola funcionamiento de la función. */
    console.log('>>! Funciona actualizar médico.');
    
    // Requiere de los siguientes datos para continuar:
    const data = this.doctorData.value;
    const id = this.medico._id;

    // Realiza la petición:
    this.medicoService.actualizaMedico(data, id).then(async (results: any) => {
      /** PRUEBA: Imprime en consola los resultados de la petición. */
      console.log(results);
      
      const toast = await this.toastController.create({
        header: results.header,
        position: 'bottom'
      });
      toast.present();
      // ... cierra la alerta en 2.5 segundos:
      setTimeout(() => {
        this.toastController.dismiss();
      }, 5000);

      this.modalController.dismiss({
        itemReturned: results.data
      });
    })
  };

}
