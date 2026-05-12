import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  PopoverController,
} from '@ionic/angular';

import { DocumentService } from '../../services/document.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @Input('documentId') documentId: number = -1;
  @Input('documentWasToJudgment') documentWasToJudgment: boolean = false;
  @Input('respuuid') respuuid: string = null;
  @Input('showResponse') showResponse: boolean = false;
  @Input('showDuplicate') showDuplicate: boolean = false;
  @Input('showTrial') showTrial: boolean = true;
  @Input('showTemplate') showTemplate: boolean = true;

  constructor(
    private popover: PopoverController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private documentService: DocumentService,
    private alertController: AlertController
  ) {}

  ClosePopover() {
    this.popover.dismiss();
  }

  goToReader() {
    this.ClosePopover();
    this.router.navigate(['/reader/' + this.respuuid, {}]);
  }

  goToResponse() {
    this.ClosePopover();
    this.router.navigate(['/text-editor', { respuuid: this.respuuid }]);
  }

  duplicate() {
    this.documentService.duplicateDocument(this.documentId).subscribe(
      () => {
        this.router.navigate(['/text-editor-list']);
      },
      (err) => console.error(err)
    );
  }

  archiveDoc() {
    this.ClosePopover();
    this.documentService.archiveDocument(this.documentId).subscribe(
      () => {
        this.router.navigate(['/doc-archive-list']);
      },
      (err) => console.error(err)
    );
  }

  async createPDF() {
    // confirma si no was_to_judgment
    if (this.documentWasToJudgment) {
      this.abrirPDF();
    } else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Acreditar en juicio',
        subHeader: 'Fin de seguimiento',
        message:
          'Al realizar esta acción el sistema dejará de guardar los movimientos en la blockchain.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {},
          },
          {
            text: 'Confirmar',
            handler: async () => {
              this.ClosePopover();
              this.abrirPDF();
            },
          },
        ],
      });

      await alert.present();
    }
  }

  async abrirPDF() {
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });
    await (await loadingSplash).present();
    this.documentService.getPDF(this.respuuid).subscribe(
      async (res) => {
        window.open(res.url);
        (await loadingSplash).dismiss();
      },
      async (err) => {
        (await loadingSplash).dismiss();
        console.error(err);
      }
    );
  }
}
