import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

import { UsuarioService } from '../../services/usuario.service';
import { DataLocalService } from '../../services/dataLocal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-account-popover',
  templateUrl: './account-popover.component.html',
  styleUrls: ['./account-popover.component.scss'],
})
export class AccountPopoverComponent implements OnInit {

  // Declarando variables para su reutilización:
  public baseUrl: string = environment.baseUrl
  public noImage: string = 'noImage.svg';

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private menuController: MenuController,
    public dataLocalService: DataLocalService,
  ) { }

  ngOnInit() {}

  logout() {
    /** PRUEBA: Imprime mensaje en consola de que el botón funciona. */
    console.log('Se cerró la sesión');

    // Si el usuario decide cerrar su sesión entonces;
    // ... elimina el token del Local Storage,
    this.dataLocalService.eliminarToken();
    // ... elimina el menú del Local Storage,
    this.dataLocalService.eliminarMenu();
    // ... cierra el popoverCard del usuario,
    this.popoverController.dismiss();
    // ... cierra el menú:
    this.menuController.close('dashboard');
    // ... y redirige a la página de inicio.
    this.router.navigateByUrl('/home');
  };

  accountPage() {
    // ... cierra el popoverCard del usuario,
    this.popoverController.dismiss();
    // ... cierra el menú:
    this.menuController.close('dashboard');
    // ... y redirige a la página de perfil de usuario.
    this.router.navigateByUrl('/dashboard/perfil');
  }

}
