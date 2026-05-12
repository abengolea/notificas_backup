import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { DocumentService } from '../../services/document.service';
import { GlobalService } from '../../services/global.service';
@Component({
  selector: 'app-text-editor-list',
  templateUrl: './text-editor-list.page.html',
  styleUrls: ['./text-editor-list.page.scss'],
})
export class TextEditorListPage implements OnInit {
  documents: any[] = [];
  wait: boolean;

  constructor(
    private documentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.wait = true;
    this.documentService.getDocumentsDraft(null).subscribe(
      (resp: any) => {
        this.documents = resp.data;
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  editDocument(docu: any) {
    this.router.navigate(['/text-editor', { uuid: docu.uuid }]);
  }

  async deleteDocument(docu: any) {
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });
    await (await loadingSplash).present();
    if (!this.wait) {
      this.wait = true;
      this.documentService.deleteDocument(docu.id).subscribe(
        async () => {
          this.globalService.showToast(
            'El documento se elimino con éxito',
            'success'
          );
          this.ionViewDidEnter();
          setTimeout(async () => {
            await (await loadingSplash).dismiss();
          }, 1000);
        },
        async () => {
          this.globalService.showToast(
            'Hubo un error al eliminar el documento',
            'error'
          );
          await (await loadingSplash).dismiss();
          this.wait = false;
        }
      );
    }
  }
}
