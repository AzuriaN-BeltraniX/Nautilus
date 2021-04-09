import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AccountPopoverComponent } from '../account-popover/account-popover.component';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent{

  // Declarando variables para su reutilización:
  popoverButton: boolean = false;
  public userImage = '';

  constructor(
    private popoverController: PopoverController,
    private usuarioService: UsuarioService
  ) { this.userImage = usuarioService.getUserImage() }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: AccountPopoverComponent,
      cssClass: 'my-custom-class',
      event: event,
      translucent: true
    });

    this.popoverButton = true;

    await popover.present();

    const { data } = await popover.onWillDismiss();
    // console.log(data);
  }

}
