import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { DocumentTemplateService } from '../services/document-template.service';
import { DocumentTypeService } from '../services/document-type.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-document-template',
  templateUrl: './document-template.page.html',
  styleUrls: ['./document-template.page.scss'],
})
export class DocumentTemplatePage implements OnInit {
  wait = false;
  documentTypes: any[];
  configCKEditor: any = {
    toolbar: [
      ['Bold', 'Italic', 'Underline'],
      ['RemoveFormat', 'NumberedList', 'BulletedList'],
      ['FontSize', 'TextColor', 'BGColor'],
    ],
  };
  documentTemplate: any = {
    name: null,
    body: '',
    documentType: null,
  };

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private documentTypeService: DocumentTypeService,
    private documentTemplateService: DocumentTemplateService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.documentTypeService.getAllDocumentTypes().subscribe((resp: any) => {
      this.documentTypes = resp.data;
    });
    if (this.activatedRoute.snapshot.params['id']) {
      this.wait = true;
      this.documentTemplateService
        .getDocumentTemplateById(this.activatedRoute.snapshot.params['id'])
        .subscribe((resp: any) => {
          console.log('resp', resp);
          this.documentTemplate = resp;
          console.log('resp', this.documentTemplate);
          this.wait = false;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  compararPorId(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  async save() {
    this.wait = true;
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });
    await (await loadingSplash).present();
    if (!!this.documentTemplate.id) {
      this.documentTemplateService
        .update(
          this.documentTemplate.id,
          this.documentTemplate.name,
          this.documentTemplate.body,
          this.documentTemplate.documentType.id
        )
        .subscribe(
          async () => {
            this.globalService.showToast(
              'El template se actualizo con exito',
              'success'
            );
            this.router.navigate(['/templates']);
            (await loadingSplash).dismiss();
          },
          async (data: any) => {
            (await loadingSplash).dismiss();
            this.globalService.showToast(
              `Hubo un error al actualzar el template. Mensaje: ${data.error.message}`,
              'error'
            );
            this.wait = false;
          }
        );
    } else {
      this.documentTemplateService
        .save(
          this.documentTemplate.name,
          this.documentTemplate.body,
          this.documentTemplate.documentType.id
        )
        .subscribe(
          async () => {
            this.globalService.showToast(
              'El template se creó con éxito',
              'success'
            );
            this.router.navigate(['/templates']);
            (await loadingSplash).dismiss();
          },
          async (data: any) => {
            (await loadingSplash).dismiss();
            this.globalService.showToast(
              `Hubo un error al crear el template. Mensaje: ${data.error.message}`,
              'error'
            );
            this.wait = false;
          }
        );
    }
  }

  canSubmit() {
    return (
      !!this.documentTemplate.name &&
      !!this.documentTemplate.body &&
      !!this.documentTemplate.documentType
    );
  }
  cancelForm() {
    this.router.navigate(['/templates']);
  }
}
