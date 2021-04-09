import { Component, OnInit, ViewChild } from '@angular/core';

import { Almacen } from 'src/app/models/almacen.model';
import { AlmacenService } from '../../../../services/almacen.service';
import { environment } from '../../../../../environments/environment';
import { IonInfiniteScroll, ModalController, IonList, AlertController } from '@ionic/angular';
import { AlmacenComponent } from './almacen/almacen.component';
import { ProductoService } from '../../../../services/producto.service';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.page.html',
  styleUrls: ['./almacenes.page.scss'],
})
export class AlmacenesPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonList) ionList: IonList;

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  public almacenes: Almacen[] = [];
  public totalRegistrados: number = 0;
  public updateList: boolean = true;
  public loading: boolean = true;
  public loaderText_Card: string = '';
  public completeListener: boolean = false;
  public listenerText: string = '';
  private desde: number = 0;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private almacenService: AlmacenService,
    private productoService: ProductoService,
  ) { }

  ngOnInit() {
    // Captura los almacenes y muéstralos en pantalla:
    this.obtenerAlmacenes();
  }

  // Función para crear un médico:
  async crearAlmacen() {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('>>! Funciona crear médico...');
    
    // Abre el modal para registrar a un nuevo médico:
    const modal = await this.modalController.create({
      component: AlmacenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        title: 'Registra un nuevo almacén',
        flag: 'register'
      }
    });
    await modal.present(); 
    // ... una vez abierto, cierra el sliding.
    this.ionList.closeSlidingItems();

    // Al cerrar el modal, recibe los datos del medico actualizado:
    const { data } = await modal.onDidDismiss();
    /** PRUEBA: Imprime en consola los datos recibidos. */
    console.log(data);

    // Si existen datos recibidos entonces ejecuta las siguientes acciones:
    if (data.itemReturned === true) {
      this.desde = 0
      this.almacenes = [];
      this.completeListener = false;
      // this.infiniteScroll.disabled = false;

      this.obtenerAlmacenes();
    };
  };

  // Función para obtener un listado de los almacenes registrados:
  async obtenerAlmacenes() {
    /** PRUEBA: Imprime en consola mensaje de acción. */
    console.log('>>> Obteniendo lista de almacenes...');
    
    await this.almacenService.obtenerAlmacenes(0).then((results: any) => {
      // ... Añade la respueste al arreglo de médicos:
      this.almacenes = results.almacenes;
      /** PRUEBA: Imprime los médicos capturados. */
      console.log('Almacenes capturados:', this.almacenes);
      // ... Muestra el total de registros:
      this.totalRegistrados = results.total;
      // ...Habilita la actualización de la lista de médicos:
      this.updateList = true;
      // ... Oculta la tarjeta de carga:
      this.loading = false;
    });
  };

  // Función para actualizar la lista de médicos registrados a la más actualizada:
  async actualizarLista_Almacenes(event) {
    // Elimina los usuarios listados en pantalla, muestra el mensaje de carga
    this.almacenes = [];
    this.completeListener = true;
    this.listenerText = 'Actualizando lista de almacenes registrados...';
    this.desde = 0;
    // this.infiniteScroll.disabled = false;

    // Relizando la petición:
    await this.almacenService.obtenerAlmacenes(0).then((results: any) => {
      // ... Añade la respuesta al arreglo de médicos:
      this.almacenes = results.almacenes;
      /** PRUEBA: Imprime los médicos capturados. */
      console.log('Almacenes actualizados capturados:', this.almacenes);
      // ... Muestra el total de registros:
      this.totalRegistrados = results.total;
      // ... Habilita la actualización de la lista de médicos:
      this.updateList = true;
      // ... Detén la actualización.
      event.target.complete();
      // ... Y oculta el mensaje de carga:
      this.completeListener = false;
    });
  };

  // Función para crear un médico:
  async editarAlmacen(almacen: Almacen) {
    /** PRUEBA: Imprime en consola los datos del almacén seleccionado. */
    console.log('Datos del almacén seleccionado:', almacen);
    
    // Abre el modal para registrar a un nuevo médico:
    const modal = await this.modalController.create({
      component: AlmacenComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        title: 'Actualiza los datos',
        flag: 'update',
        nombre: almacen.nombre || '',
        img: almacen.img || 'noimage.svg',
        stockID: almacen._id
      }
    });
    await modal.present(); 
    // ... una vez abierto, cierra el sliding.
    this.ionList.closeSlidingItems();

    // Al cerrar el modal, recibe los datos del medico actualizado:
    const { data } = await modal.onDidDismiss();
    /** PRUEBA: Imprime en consola los datos recibidos. */
    // console.log(data);

    // Si existen datos recibidos entonces ejecuta las siguientes acciones:
    if (data.itemReturned === true) {
      this.desde = 0
      this.almacenes = [];
      this.completeListener = false;
      // this.infiniteScroll.disabled = false;

      this.obtenerAlmacenes();
    };
  };

  // Función para eliminar un almacén:
  async eliminarAlmacen(almacen: Almacen) {
    /** PRUEBA: Imprime en consola los datos del almacén seleccionado. */
    console.log('Datos del almacén seleccionado:', almacen);

    // Requiere de los siguientes datos para continuar:
    const id = almacen._id;

    // Muestra una alerta antes de eliminar al usuario:
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: `¿Seguro?`,
      message: `Estas por eliminar el almacén ${almacen.nombre}, si deseas ejecutar la acción, presiona Eliminar.`,
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'delete',
          handler: async () => {
            // Realizando la petición;
            await this.almacenService.eliminaAlmacen(id).then(async (result: any) => {
              // Si la petición fue exitosa entonces muestra una alerta con los datos recibidos:
              const alert = await this.alertController.create({
                backdropDismiss: false,
                header: result
              });
              await alert.present();

              setTimeout(() => {
                this.alertController.dismiss();
              }, 2000);

              // ...borra al usuario eliminado de la lista de usuarios mostrados y,
              const almacenSelec = this.almacenes.findIndex(m => m._id === almacen._id);
              this.almacenes.splice(almacenSelec, 1);

              // Resta 1 al conteo de registros:
              this.totalRegistrados -= 1;

              // ... cierra el sliding.
              this.ionList.closeSlidingItems();
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

  // Función para eliminar un almacén:
  async obtenerProductos_Almacen(almacen: Almacen) {
    /** PRUEBA: Imprime en consola los datos del almacén seleccionado. */
    console.log('Datos del almacén seleccionado:', almacen);

    this.productoService.obtenerProductos(0).then(async (results: any) => {
      /** PRUEBA: Imprime en consola la respuesta de la petición. */
      console.log(results);

      // Abre el modal para registrar a un nuevo médico:
      const modal = await this.modalController.create({
        component: AlmacenComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          title: 'Productos',
          flag: 'products',
          stockID: almacen._id,
          stockName: almacen.nombre,
          products: results.productos
        }
      });
      await modal.present(); 
      // ... una vez abierto, cierra el sliding.
      this.ionList.closeSlidingItems();
    });

  };

}
