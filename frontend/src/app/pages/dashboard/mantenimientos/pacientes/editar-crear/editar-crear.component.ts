import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController, ActionSheetController, PickerController } from '@ionic/angular';
import { environment } from '../../../../../../environments/environment.prod';
import { FormBuilder, Validators } from '@angular/forms';

import { Paciente } from '../../../../../models/paciente.model';
import { PacienteService } from '../../../../../services/paciente.service';
import { HardwarecontrollerService } from '../../../../../services/hardware-controller.service';
import { MedicoService } from '../../../../../services/medico.service';

@Component({
  selector: 'app-editar-crear',
  templateUrl: './editar-crear.component.html',
  styleUrls: ['./editar-crear.component.scss'],
})
export class EditarCrearComponent implements OnInit {

  @Input() paciente: Paciente;
  @Input() create: boolean;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  // Declarando el formulario para las peticiones:
  public updatePatient: any;
  public createPatient: any;
  public testForm: any;
  public instruction: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private pickerController: PickerController,
    private actionSheetController: ActionSheetController,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private hardwarecontrollerService: HardwarecontrollerService
  ) { this.escogerDoctor(); }

  ngOnInit() {
    // Construyendo el formulario correspondiente:
    this.buildForms();
  }

  // Función que construye los formularios dependido de la bandera recibida desde el padre:
  buildForms() {
    /** PRUEBA: Imprime el valor de la bandera recibida. */
    console.log(this.create);

    // Construyendo los formularios depoendiendo de la bandera recibida:
    if (this.create === true) {
      this.instruction = 'Registra un nuevo paciente';

      this.createPatient = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        edad: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        doctor: ['5fac15782f6a0519a4501064', [Validators.required]]
      });
    } else {
      let dividirNombre = this.paciente.nombre.split(' ');      

      this.instruction = `Editar datos de ${dividirNombre[0]}` ;

      this.updatePatient = this.formBuilder.group({
        nombre: [this.paciente.nombre, [Validators.required, Validators.minLength(3)]],
        edad: [this.paciente.edad, [Validators.required]],
        email: [this.paciente.email, [Validators.required, Validators.email]]
      });
    };
  };

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
            this.modalController.dismiss();
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
  actualizarPaciente() {
    /** PRUEBA: Imprime en consola funcionamiento de la función. */
    console.log('>>! Funciona actualizar médico.');
    
    // Requiere de los siguientes datos para continuar:
    const data = this.updatePatient.value;
    const id = this.paciente._id;

    // Realiza la petición:
    this.pacienteService.actualizarPaciente(data, id).then(async (results: any) => {
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

  // Función que registra a un paciente:
  registrarPaciente() {
    /** PRUEBA: Imprime en consola funcionamiento de la función. */
    console.log('>>! Funciona registrar paciente.');
    
    // Requiere de los siguientes datos para continuar:
    const data = this.createPatient.value;

    // Realiza la petición:
    this.pacienteService.crearPaciente(data).then(async (results: any) => {
      /** PRUEBA: Imprime en consola los resultados de la petición. */
      console.log(results);
      
      const toast = await this.toastController.create({
        header: 'Paciente registrado exitosamente.',
        position: 'bottom'
      });
      toast.present();
      // ... cierra la alerta en 2.5 segundos:
      setTimeout(() => {
        this.toastController.dismiss();
      }, 3000);

      this.modalController.dismiss({
        itemReturned: true
      });
    })
  };

  escogerDoctor() {
    // Carga los doctores y almacénalos en una variable:
    this.medicoService.obtenerMedicos(0).then(results => {
      console.log(results);
      
    })

  };

}
