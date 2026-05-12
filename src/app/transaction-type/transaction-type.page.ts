import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { GlobalService } from '../services/global.service';
import { TransactionTypeService } from '../services/transaction-type.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.page.html',
  styleUrls: ['./transaction-type.page.scss'],
})
export class TransactionTypePage implements OnInit {
  wait = false;
  transactionType: any = {};

  transactioTypeForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    code: ['', []],
    price: ['', []],
    total: ['', []],
    gender: ['', []],
  });
  // gender: any;
  comparador:string;

  constructor(
    private formBuilder: FormBuilder,
    private transactioTypeService: TransactionTypeService,
    private globalService: GlobalService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get name() {
    return this.transactioTypeForm.get('name');
  }
  get code() {
    return this.transactioTypeForm.get('code');
  }
  get price() {
    return this.transactioTypeForm.get('price');
  }
  get total() {
    return this.transactioTypeForm.get('total');
  }
  get gender() {
    return this.transactioTypeForm.get('gender');
  }

  public errorMessages = {
    name: [
      {
        type: 'required',
        message:
          'Por favor, ingrese su nombre, es necesario para completar el registro.',
      },
    ],
  };

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.activatedRoute.snapshot.params['id']) {
      this.transactioTypeService
        .getTransactionTypeById(this.activatedRoute.snapshot.params['id'])
        .subscribe((resp: any) => {

          console.log('Respuesta*************')
          console.log(resp)
          console.log(resp.name);
          console.log(resp.code);
          console.log(resp.price);
          console.log(resp.total);
          console.log(resp.gender);
          console.log('****************************');


          this.name.setValue(resp.name);
          this.code.setValue(resp.code);
          this.price.setValue(resp.price);
          this.total.setValue(resp.total);
          this.gender.setValue(resp.gender);
          this.transactionType = resp;
          this.changeDetectorRef.detectChanges();
          this.comparador=resp.name;
        });
    }
  }

  async update() {
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });
    await (await loadingSplash).present();
    this.wait = true;
  console.log(
    this.name.value + " ",
    this.code.value + " ",
    this.price.value + " ",
    this.total.value + " ",
    this.gender.value + " ",
  )

    this.transactioTypeService
      .updateTransactionTypes(this.transactionType.id, {
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
          this.router.navigate(['/transactions-types']);
          (await loadingSplash).dismiss();
        },
        async (data: any) => {
          (await loadingSplash).dismiss();
          this.globalService.showToast(
            `Hubo un error al actualzar el tipo de transacción. Mensaje: ${data.error.message}`,
            'error'
          );
          this.wait = false;
        }
      );
  }

  canSubmit() {
    return !!this.name.value && this.name.value.trim() !== '';
  }

  cancelForm() {
    this.transactioTypeForm.reset();
    this.router.navigate(['/transactions-types']);
  }
}
