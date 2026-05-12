import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { DocumentService } from '../services/document.service';
import { GlobalService } from '../services/global.service';
import { MultimediaService } from '../services/multimedia.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {
  wait = true;

  document: any = {
    subject: null,
    body: '',
    senderSelected: null,
    destinationSelected: [],
    multimedias: [],
    senderType: 'personal',
    total: 0,
  };

  constructor(
    private menu: MenuController,
    private documentService: DocumentService,
    private globalService: GlobalService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private multimediaService: MultimediaService
  ) {}

  ngOnInit() {}

  banResponder = false;
  muestraBotonResponder() {
    // verifica si puede responder
    this.banResponder = true;
    this.document.documentUsers.forEach((du) => {
      if (
        du.documentUserType.id == 3 &&
        this.userService.getUser().id == du.user.id
      ) {
        this.banResponder = false;
      }
    });
  }

  buscaDocPorUuid(uuid: string) {
    this.wait = true;
    this.documentService.getDocumentsByUUID(uuid).subscribe(
      (resp: any) => {
        this.wait = false;
        if (resp.data && resp.data.uuid) {
          this.document = resp.data;
          this.muestraBotonResponder();
        } else {
          this.globalService.showToast('Documento no existente', 'warning');
          this.router.navigate(['/']);
        }
      },
      () => {
        this.wait = false;
        this.globalService.showToast('Documento no existente', 'warning');
        this.router.navigate(['/']);
      }
    );
  }

  ionViewWillEnter() {
    if (!this.userService.getToken()) {
      this.menu.enable(false);
    }

    if (this.activatedRoute.snapshot.params['uuid']) {
      // busca segun el uuid, de posible transaction
      this.documentService
        .getDocumentsByUUIDReader(this.activatedRoute.snapshot.params['uuid'])
        .subscribe(
          (resp: any) => {
            this.wait = false;
            if (resp.data && resp.data.uuid) {
              this.document = resp.data;
              this.muestraBotonResponder();
            } else {
              // si no encontro, verifica si hay usuario logueado en tal caso puede ser que el uuid sea de un documento
              if (this.userService.getToken()) {
                this.buscaDocPorUuid(
                  this.activatedRoute.snapshot.params['uuid']
                );
              } else {
                this.globalService.showToast(
                  'Documento no existente',
                  'warning'
                );
                this.router.navigate(['/']);
              }
            }
          },
          () => {
            this.wait = false;
            // si no encontro, verifica si hay usuario logueado en tal caso puede ser que el uuid sea de un documento
            if (this.userService.getToken()) {
              this.buscaDocPorUuid(this.activatedRoute.snapshot.params['uuid']);
            } else {
              this.globalService.showToast('Documento no existente', 'warning');
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  muestraSiNoEsRemitente(t) {
    if (t.transactionType.id == 32) {
      return true;
    }
    for (let i = 0; i < this.document.documentUsers.length; i++) {
      let du = this.document.documentUsers[i];
      if (du.documentUserType.id == 3 && t.user.id == du.user.id) {
        return false;
      }
    }
    return true;
  }

  async download(key: string) {
    const loadingSplash = this.loadingCtrl.create({
      message: 'Descargando...',
    });
    await (await loadingSplash).present();
    this.multimediaService.getDownloadSignedUrl(key).subscribe(
      async (resp: any) => {
        window.open(resp.url, '_blank');
        (await loadingSplash).dismiss();
      },
      async () => (await loadingSplash).dismiss()
    );
  }

  showMoreInfo(t) {
    const details = JSON.parse(t.details);
    if (details) {
      if (details.ip) {
        return `UUID: ${t.uuid} <br>IP: ${details.ip} <br>Navegador: ${details.browser.name} v${details.browser.version}`;
      } else if (details.filename) {
        return `Nombre: ${details.filename} <br>Key: ${details.key}`;
      }
    }
    return 'Sin datos extras';
  }

  reply() {
    if (this.userService.getUser() == null) {
      // si no hay usuario lleva al login
      this.router.navigate(['/login', {}]);
    }
    let ban = true;
    // verifica si puede responder
    this.document.documentUsers.forEach((du) => {
      if (
        du.documentUserType.id == 3 &&
        this.userService.getUser().id == du.user.id
      ) {
        ban = false;
      }
    });
    if (ban) {
      this.router.navigate(['/text-editor', { respuuid: this.document.uuid }]);
    } else {
      this.globalService.showToast(
        'No puede responder un documento enviado por usted mismo.',
        'danger'
      );
    }
  }
}
