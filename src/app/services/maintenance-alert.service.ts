import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceAlertService {
  constructor(private alertController: AlertController) {}

  get isMaintenanceBlocked(): boolean {
    return environment.maintenanceBlocked === true;
  }

  async present(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Acceso no disponible',
      message:
        'La web está en mantenimiento: por ahora no es posible ingresar ni usar la aplicación. ' +
        'El botón de abajo solo cierra este mensaje y no habilita el acceso hasta que volvamos a estar en línea. Gracias por tu paciencia.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cerrar aviso',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
