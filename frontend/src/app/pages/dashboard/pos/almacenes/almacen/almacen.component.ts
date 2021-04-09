import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

import { AlmacenService } from '../../../../../services/almacen.service';
import { ProductoService } from '../../../../../services/producto.service';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.scss'],
})
export class AlmacenComponent implements OnInit {

  @Input() titulo: string;
  @Input() flag: string;
  @Input() img: string;
  @Input() stockID: string;
  @Input() stockName: string;
  @Input() products: any;
  
  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl;
  public productos: Producto[] = [];
  public productosEnAlmacen: Producto[] = [];

  // Declarando el formulario para su envío:
  public stockData = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private almacenService: AlmacenService,
    private productoService: ProductoService,
  ) { }

  ngOnInit() {
    this.cargarProductosAlmacen(this.stockID);
  }

  // Función para enviar los datos del formulario para registrar un nuevo almacén:
  crearAlmacen() {
    /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
    console.log('>>! Funciona crear médico...');
    /** PRUEBA: Imprime en consola los valores obtenidos del formulario. */
    console.log(this.stockData.value);

    // Realiza la petición:
    this.almacenService.crearAlmacen(this.stockData.value).then(async (result: any) => {
      /** PRUEBA: Imprime en consola los datos del nuevo doctor. */
      console.log(result);

      // Si existe la id del nuevo doctor en la respuesta, entonces cierra el modal,
      if (result.almacen) {
        this.modalController.dismiss({
          itemReturned: true
        });

        // ... y muestra mensaje de éxito en pantalla:
        const toast = await this.toastController.create({
          header: result.header,
          position: 'bottom'
        });
        toast.present();
        // ... cierra la alerta en 2.5 segundos:
        setTimeout(() => {
          this.toastController.dismiss();
        }, 5000);
      } else {
        // ... Si la respuesta no es correcta, entonces muestra una alerta:
        const alert = await this.alertController.create({
          backdropDismiss: false,
          header: result.error.header,
          message: result.error.msg,
          buttons: ['ok']
        });
        // ... presenta el mensaje creado
        await alert.present();
      }
    });
  }; 

  // Función para actualizar los datos de un almacén seleccionado:
  actualizarAlmacen() {
      /** PRUEBA: Imprime en consola mensaje de funcionamiento. */
      console.log('>>! Funciona actualizar almacén...');
      /** PRUEBA: Imprime en consola los valores obtenidos del formulario. */
      console.log(this.stockData.value);

      // Captura el ID de almacén recibido:
      const id = this.stockID;
      console.log(id);
      
  
      // Realiza la petición:
      this.almacenService.actualizaAlmacen(this.stockData.value, this.stockID).then(async (result: any) => {
        /** PRUEBA: Imprime en consola los datos del nuevo doctor. */
        console.log(result);
  
        // Si existe la id del nuevo doctor en la respuesta, entonces cierra el modal,
        if (result.almacen) {
          this.modalController.dismiss({
            itemReturned: true
          });
  
          // ... y muestra mensaje de éxito en pantalla:
          const toast = await this.toastController.create({
            header: result.header,
            position: 'bottom'
          });
          toast.present();
          // ... cierra la alerta en 2.5 segundos:
          setTimeout(() => {
            this.toastController.dismiss();
          }, 5000);
        } else {
          // ... Si la respuesta no es correcta, entonces muestra una alerta:
          const alert = await this.alertController.create({
            backdropDismiss: false,
            header: result.error.header,
            message: result.error.msg,
            buttons: ['ok']
          });
          // ... presenta el mensaje creado
          await alert.present();
        }
      });
  }; 

  cargarProductosAlmacen(stockID: string) {    
    this.productos = this.products;

    this.productos.forEach((itemProducto: Producto) => {
      itemProducto.inventario.forEach((itemAlmacen) => {
        if (stockID === itemAlmacen.almacen.toString()) {
          itemProducto.cantidad = itemAlmacen.cantidad;
          this.productosEnAlmacen.push(itemProducto);
        }
      });
    });
  };

  // Función para cerrar el Modal
  cerrarModal() {
    this.modalController.dismiss({
      itemReturned: false
    });
  };

}
