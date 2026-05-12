import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { DocumentService } from '../services/document.service';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  wait = false;
  document: any = {
    uuid: ''
  };
  historial:any = [];

  constructor(
    private menu: MenuController,
    private documentService: DocumentService,
    private globalService: GlobalService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.userService.getToken()) {
      this.menu.enable(false);
    }
  }

  getHistory(){
    this.historial = [];
    this.wait = true;
    this.documentService
      .getHistoryByUUID(this.document.uuid)
      .subscribe(
        (resp: any) => {
          this.wait = false;
          if (resp.data.length == 0){
            this.globalService.showToast(
              'Documento no existente',
              'warning'
            );
          } else{

            for (let i=0; i < resp.data.length; i++){
              let d = resp.data[i].data;
              let data: any = [];

              data.document = {
                subject: d.subject,
                hash_subject: d.hash_subject,
                body: d.body,
                hash_body: d.hash_body,
                createdat: d.createdat,
                documentsType: JSON.parse(d.documentsType),
                destinations: JSON.parse(d.destinations),
                senders: JSON.parse(d.senders)
              };
              data.transaction = JSON.parse(d.transaction);
              console.log(data);

              this.historial.push(data);
            }

            this.globalService.showToast(
              'Documento encontrado',
              'success'
            );
          }
        },
        () => {
          this.wait = false;
          this.globalService.showToast('Documento no existente', 'warning');
        }
      );
  }

}
