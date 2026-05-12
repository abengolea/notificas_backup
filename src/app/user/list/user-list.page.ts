import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ProofService } from 'src/app/services/proof.service';

import { UserAdminService } from '../../services/user-admin.service';
import { ModalHistoryProofsPage } from '../modal-history-proofs/modal-history-proofs.page'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  users: any[] = [];
  textSearch: string | null;
  wait: boolean;

  constructor(
    private userAdminService: UserAdminService,
    private router: Router,
    private globalService: GlobalService,
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public proofService: ProofService,
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

  newUser() {
    this.router.navigate(['/users/new']);
  }

  editUser(user: any) {
    /**
    if (user.useruser_id) {
      this.router.navigate([`/contacts/edit/${user.useruser_id}`]);
    } else {
      this.globalService.showToast(
        `Es un contacto público, no puede editar sus datos.`,
        'warning'
      );
    }**/
  }

  deleteUser(id: string) { }

  saveIsBlocked(user: any) {
    user.isBlocked = !user.isBlocked;
    this.wait = true;
    this.userAdminService
      .saveIsBlocked({ ...{ id: user.id, isBlocked: user.isBlocked } })
      .subscribe(
        async (resp: any) => {
          this.wait = false;
          if (user.isBlock) {
            this.globalService.showToast('Usuario bloqueado');
          } else {
            this.globalService.showToast('Usuario desbloqueado');
          }
        },
        async (err: any) => {
          this.wait = false;
          this.globalService.showToast(`${err.error.message}`);
        }
      );
  }

  private initData(text: string | null) {
    this.wait = true;
    this.userAdminService.getUsers(1, 500, text).subscribe(
      (resp: any) => {
        this.users = resp.data;
        this.wait = false;
      },
      () => {
        this.wait = false;
      }
    );
  }

  async viewMovimientos(id: number, nombre: string, apellido: string, email: string, proofs: string, coins: string) {
    const modal = await this.modalCtrl.create({
      component: ModalHistoryProofsPage,
      componentProps: {
        id: id,
        nombre: nombre,
        apellido: apellido,
        email: email,
        proofs: proofs,
        coins: coins
      },
      cssClass: "modalhistorico"
    });
    return await modal.present();
  }

  addCoinsByAdmin(id: number, email: string, coins: number) {
    let alerta = this.alertController.create({
      header: 'Bonificacion',
      subHeader: `${email}`,
      message: `Credito actual <span class='alert-coins'>${coins}</span> coins <br>Ingrese Coins the bonificacion`,
      cssClass: 'buttonCss',
      backdropDismiss: false,
      inputs: [
        {
          type: 'number',
          name: 'coinsAdicionales',
          placeholder: 'Ingrese Coins',
          min: 0,
          max: 10000,
          cssClass: 'alert-input',

        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'cancel-button',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Confirmar!',
          cssClass: 'confirm-button',
          handler: (data: any) => {
            // this.validarEntero(data.coinsAdicionales)
            let CoinsAdded = parseInt(data.coinsAdicionales);
            if (isNaN(CoinsAdded)) {
              this.globalService.showToast(`ERROR: El Valor no es un numero .`, 'danger');
              return false
            } else {
              if (CoinsAdded <= 0 || CoinsAdded > 10000) {
                this.globalService.showToast(`Los Coins deben ser mayores a 0 e inferiores a 10000.`, 'warning');
                return false;
              }
              else {
                this.globalService.showToast(`Se Bonifico al usuario con ${CoinsAdded} coins adicionales.`, 'success');
                this.proofService.addCoinsByAdmin({ id: id, coins: coins, coinsadded: CoinsAdded, email: email }).subscribe(
                  () => {this.initData(null);});
                return true
              }
            }
          }

        }
      ]
    }).then(res => {
      res.present();
      // this.initData(null);

    });
  }
}
