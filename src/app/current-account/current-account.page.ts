import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { ProofService } from '../services/proof.service';
import { TransactionTypeService } from '../services/transaction-type.service';

@Component({
  selector: 'app-current-account',
  templateUrl: './current-account.page.html',
  styleUrls: ['./current-account.page.scss'],
})
export class CurrentAccountPage implements OnInit {
  beneficioCode = '';
  movimientos: any = [];
  transactionstypes: any = [];
  transactionstypeSel: any = {};
  wait = false;

  constructor(
    public proofService: ProofService,
    private globalService: GlobalService,
    private transactionTypeService: TransactionTypeService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.listarMovimientos();
    this.wait = true;
    this.transactionTypeService.getTransactionTypesForSale().subscribe(
      (resp: any) => {
        this.transactionstypes = resp;
        this.transactionstypeSel = this.transactionstypes[0];
        this.wait = false;
      },
      () => {}
    );
  }

  listarMovimientos() {
    this.wait = true;
    this.proofService.getCurrentAccount().subscribe((res) => {
      this.movimientos = res.data;
      this.proofService.refreshBalanceCoins();
      this.wait = false;
    });
  }

  beneficioObtener() {
    this.wait = true;
    this.proofService.addBonus({ code: this.beneficioCode }).subscribe(
      async (resp: any) => {
        this.wait = false;
        console.log(resp);
        if (resp != true) {
          this.globalService.showToast('No Existen mas Bonos Disponibles!', 'warning');
        }else{
          console.log(resp);
        this.listarMovimientos();
        this.globalService.showToast('Cargado con éxito!', 'success');
        }

      },
      async (data) => {
        this.wait = false;
        this.globalService.showToast(`${data.error.message}`, 'danger');
      }
    );
  }

  banComprar = false;
  goCargarSaldo() {
    // this.globalService.showToast(
    //   'Próximamente... ' + this.transactionstypeSel.name,
    //   'warning'
    // );
    this.wait = true;
    this.proofService
      .checkout({ transactionstype_id: this.transactionstypeSel.id })
      .subscribe(
        async (res: any) => {
          //console.log(res);
          window.open(res.mp_preference_url);

          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Link de pago generado',
            message: 'Muchas gracias',
            buttons: [
              {
                text: 'Confirmar',
                handler: () => {
                  this.listarMovimientos();
                },
              },
            ],
          });

          await alert.present();
          this.wait = false;
        },
        async (data) => {
          this.wait = false;
          this.globalService.showToast(`${data.error.message}`, 'danger');
        }
      );
  }

  goSolicitarCoins() {
    this.wait = true;
    this.proofService.getBonus({}).subscribe(
      async (resp: any) => {
        this.wait = false;
        this.globalService.showToast(
          'Gracias! Próximamente nos pondremos en contacto contigo.',
          'success'
        );
      },
      async (data) => {
        this.wait = false;
        this.globalService.showToast(`${data.error.message}`, 'danger');
      }
    );
  }
}
