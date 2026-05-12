import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

import { NotificationsComponent } from '../popovers/notifications/notifications.component';
import { DocumentService } from '../services/document.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  currentUser: any = null;

  documents: any[] = [];
  wait: boolean = false;

  dato1: number = 0
  dato2: number = 0
  dato3: number = 0
  dato4: number = 0
  dato5: number = 0
  dato6: number = 0
  dato7: number = 0
  dato8: number = 0
  dato9: number = 0
  dato10: number = 0
  dato11: number = 0

  documentosFiltrados: any[] = [];
  buscador: string = '';


  constructor(
    private documentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private menu: MenuController,
    private userService: UserService
  ) { }

  ngOnInit() { }



  ionViewDidEnter() {
    this.buscador = '';
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = this.userService.getUser();

    this.wait = true;
    this.documentService.getDocumentsSended(null).subscribe(
      (resp: any) => {
        this.documents = resp.data;
        this.documentosFiltrados = resp.data;
        this.wait = false;
        this.changeDetectorRef.detectChanges();
        this.statusChips(this.documents);
      },
      () => {
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  statusChips(documentos: any) {
    // console.log(documentos)
    this.dato1 = this.dato2 = this.dato3 = this.dato4 = this.dato5 = this.dato6 = this.dato7 = this.dato8 = this.dato9 = this.dato10 = this.dato11 = 0

    for (let index = 0; index < documentos.length; index++) {
      const element = documentos[index];
      switch (documentos[index].documentType.name) {
        case 'Comunicación':
          this.dato1++
          break;
        case 'Notificación':
          this.dato2++
          break;
        case 'Contestación':
          this.dato3++
          break;
        case 'Oferta':
          this.dato4++
          break;
        case 'Intimación':
          this.dato5++
          break;
        case 'Oficio Judicial':
          this.dato6++
          break;

        default:
          break;
      }
    }
  }

  filterByAlias(alias) {
    this.documentosFiltrados = this.documents.filter(i => i.documentType.alias.includes(alias));
  }

  search() {
    setTimeout(() => { console.log(this.buscador) }, 3000);
    this.documentosFiltrados = this.documents.filter((doc) => {
      return (
        doc.hasOwnProperty('documentType') && doc.documentType.name.toLocaleLowerCase().includes(this.buscador.toLocaleLowerCase()) ||
        doc.hasOwnProperty('documentUsers') && (this.search_2(doc, this.buscador)) ||
        doc.hasOwnProperty('subject') && doc.subject.toLocaleLowerCase().includes(this.buscador.toLocaleLowerCase()) ||
        doc.hasOwnProperty('lastTransaction') && doc.lastTransaction.transactionType.name.toLocaleLowerCase().includes(this.buscador.toLocaleLowerCase())
    )
})
  }
  search_2(registro, textoABuscar) {
    const respuesta = registro.documentUsers.filter((element) => {
      if (element.user.lastname !== null) { return element.user.lastname.toLocaleLowerCase().includes(textoABuscar.toLocaleLowerCase()) || element.user.firstname.toLocaleLowerCase().includes(textoABuscar.toLocaleLowerCase())}
    })
    return respuesta.length > 0 ? true : false;
  }

  clearSearch() {
    this.buscador = "";
    this.search()
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  newNotification() {
    this.router.navigate(['/text-editor']);
  }

  goToReader(uuid: string) {
    console.log(this.documentosFiltrados)
    console.log(uuid)
    this.router.navigate([`/reader/${uuid}`, {}]);
  }

  async createPopover(ev: any, document: any) {
    let showResponse = false;
    let showDuplicate = false;
    if (!!document && document.documentUsers.length > 0) {
      const idx = document.documentUsers.findIndex(
        (docUser: any) =>
          !!docUser.user &&
          !!this.currentUser &&
          this.currentUser.id === docUser.user.id &&
          !!docUser.documentUserType &&
          docUser.documentUserType.alias === 'destination'
      );
      showResponse = idx !== -1 && !document.documentId;

      const idxSender = document.documentUsers.findIndex(
        (docUser: any) =>
          !!docUser.user &&
          !!this.currentUser &&
          this.currentUser.id === docUser.user.id &&
          !!docUser.documentUserType &&
          docUser.documentUserType.alias === 'sender'
      );
      showDuplicate = idxSender !== -1 && !document.documentId;
    }

    const pop = await this.popoverController.create({
      component: NotificationsComponent,
      componentProps: {
        showResponse: showResponse,
        respuuid: document.uuid,
        documentId: document.id,
        documentWasToJudgment: document.wasToJudgment,
        showDuplicate: showDuplicate,
      },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    return await pop.present();
  }
}
