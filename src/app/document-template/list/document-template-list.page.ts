import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '../../services/global.service';
import { DocumentTemplateService } from '../../services/document-template.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-document-template-list',
  templateUrl: './document-template-list.page.html',
  styleUrls: ['./document-template-list.page.scss'],
})
export class DocumentTemplateListPage implements OnInit {
  templates: any[];
  textSearch: string | null;
  wait: boolean;

  constructor(
    private documentTemplateService: DocumentTemplateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.initData(null);
  }

  search() {
    if (!!this.textSearch && this.textSearch.trim() !== '') {
      this.initData(this.textSearch);
    } else {
      this.initData(null);
    }
  }

  edit(id: number) {
    this.router.navigate([`/templates/edit/${id}`]);
  }

  new() {
    this.router.navigate([`/templates/new`]);
  }

  private initData(text: string | null) {
    this.wait = true;
    this.documentTemplateService.getDocumentTemplates(text).subscribe(
      (resp: any) => {
        this.templates = resp.data;
        console.log('Templates', this.templates);
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.wait = false;
      }
    );
  }

  async delete(template: any) {
    if ( ! template.banSeguroDelete){
      template.banSeguroDelete = true;
      setTimeout(async () => {
        template.banSeguroDelete = false;
      }, 3000);
    } else{
      let loadingSplash = this.loadingCtrl.create({
        message: 'Por favor espere...',
      });
      await (await loadingSplash).present();
      if (!this.wait) {
        this.wait = true;
        this.documentTemplateService.deleteDocumentTemplate(template.id).subscribe(
          async () => {
            this.globalService.showToast(
              'La plantilla se elimino con éxito',
              'success'
            );
            this.initData(null);
            setTimeout(async () => {
              await (await loadingSplash).dismiss();
            }, 1000);
          },
          async () => {
            this.globalService.showToast(
              'Hubo un error al eliminar la plantilla',
              'error'
            );
            await (await loadingSplash).dismiss();
            this.wait = false;
          }
        );
      }
    }
  }
}
