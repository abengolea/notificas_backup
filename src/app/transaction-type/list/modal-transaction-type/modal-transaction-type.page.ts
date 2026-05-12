import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { TransactionTypeService } from 'src/app/services/transaction-type.service';

@Component({
  selector: 'app-modal-transaction-type',
  templateUrl: './modal-transaction-type.page.html',
  styleUrls: ['./modal-transaction-type.page.scss'],
})
export class ModalTransactionTypePage implements OnInit {
  wait = false;
  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private transactioTypeService: TransactionTypeService,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService,
    private router: Router,
  ) { }

  get name() {
    return this.nuevaOfertaForm.get('name');
  }
  get code() {
    return this.nuevaOfertaForm.get('code');
  }
  get price() {
    return this.nuevaOfertaForm.get('price');
  }
  get total() {
    return this.nuevaOfertaForm.get('total');
  }
  get gender() {
    return this.nuevaOfertaForm.get('gender');
  }


  transactionType: any = {};

  nuevaOfertaForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    code: [null, []],
    price: [null, [ Validators.pattern("^[0-9]*$")]],
    total: [null, []],
    gender: [null, []],
  })

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.wait = true;
  }

  salir() {
    this.modalCtrl.dismiss();
    this.nuevaOfertaForm.reset();
  }


  async save() {
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });

    // if(true){

    // }

    console.log(
      this.name.value,
      this.code.value,
      this.price.value,
      this.total.value,
      this.gender.value,
    )
    await (await loadingSplash).present();
    this.wait = true;
    this.transactioTypeService
      .saveTransactionTypes({
        name: this.name.value,
        code: this.code.value,
        price: this.price.value,
        total: this.total.value,
        gender: this.gender.value,
      })
      .subscribe(
        async () => {
          this.wait = false;
          this.globalService.showToast(
            'El tipo de transacción se actualizó con éxito',
            'success'
          );
          this.modalCtrl.dismiss();
          (await loadingSplash).dismiss();
        },
        async (data: any) => {
          (await loadingSplash).dismiss();
          this.globalService.showToast(
            `Hubo un error al guardar el tipo de transacción. Mensaje: ${data.error.message}`,
            'danger'
          );
          this.wait = false;
        }
      );
  }

}
