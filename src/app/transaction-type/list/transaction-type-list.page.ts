import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TransactionTypeService } from '../../services/transaction-type.service';
import { GlobalService } from '../../services/global.service';
import { ModalController } from '@ionic/angular';
import { ModalTransactionTypePage } from './modal-transaction-type/modal-transaction-type.page';
@Component({
  selector: 'app-transaction-type-list',
  templateUrl: './transaction-type-list.page.html',
  styleUrls: ['./transaction-type-list.page.scss'],
})
export class TransactionTypeListPage implements OnInit {
  types: any[] = [];
  textSearch: string | null;
  wait: boolean;

  constructor(
    private transactionTypeService: TransactionTypeService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

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
    this.router.navigate([`/transactions-types/edit/${id}`]);
  }

  toggleActive(type) {
    type.active = !type.active;
    this.wait = true;
    this.transactionTypeService
      .toggleActive(type.id, {
        active: type.active,
      })
      .subscribe(
        async () => {
          this.wait = false;
          this.globalService.showToast(
            'El tipo de transacción se actualizó con éxito',
            'success'
          );
        },
        async (data: any) => {
          this.globalService.showToast(
            `Hubo un error al actualzar el tipo de transacción. Mensaje: ${data.error.message}`,
            'error'
          );
          this.wait = false;
        }
      );
  }

  private initData(text: string | null) {
    this.wait = true;
    this.transactionTypeService.getTransactionTypes(text).subscribe(
      (resp: any) => {
        this.types = resp.data;
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.wait = false;
      }
    );
  }

  async agregarOferta() {
    // alert('Lanzar Modal');
    const modal = await this.modalCtrl.create({
      component: ModalTransactionTypePage,
      componentProps: {
        id: "id",
        nombre: "nombre",
        apellido: "apellido",
        email: "email",
        proofs: "proofs",
        coins: "coins"
      },
      cssClass: "modalOFerta"
    });
    modal.onDidDismiss().then(() => {
      console.log('Refrescando')
      this.initData(null);
    });
    return await modal.present();
  }
}
