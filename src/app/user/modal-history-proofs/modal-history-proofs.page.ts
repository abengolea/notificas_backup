import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProofService } from 'src/app/services/proof.service';
import { TransactionTypeService } from 'src/app/services/transaction-type.service';

@Component({
  selector: 'app-modal-history-proofs',
  templateUrl: './modal-history-proofs.page.html',
  styleUrls: ['./modal-history-proofs.page.scss'],
})
export class ModalHistoryProofsPage implements OnInit {
  @Input() id: number;
  @Input() nombre: string;
  @Input() apellido: string;
  @Input() email: string;
  @Input() proofs: string;
  @Input() coins: string;

  movimientos: any = [];
  transactionstypes: any = [];
  transactionstypeSel: any = {};
  wait = false;

  constructor(
    private modalCtrl: ModalController,
    public proofService: ProofService,
    private transactionTypeService: TransactionTypeService

  ) { }

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
    this.proofService.getCurrentAccountByID(this.id).subscribe((res) => {
      this.movimientos = res.data;
      this.proofService.refreshBalanceCoins();
      this.wait = false;
      console.log(res.data)
    });
  }

  ngOnInit() {
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
