import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { GlobalService } from '../services/global.service';
import { MultimediaService } from '../services/multimedia.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  wait = false;
  userList: any[] = [];
  multimediaList: any[] = [];
  user: any = {};
  contactUser: any = {
    user: null,
  };
  usersSubscription: Subscription;
  textSearch: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private globalService: GlobalService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private multimediaService: MultimediaService
  ) {}

  contactForm = this.formBuilder.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    dni: ['', []],
    cuit: ['', []],
    phoneNumber: ['', []],
    email: ['', []],
    isEmpowered: ['', []],
  });

  get firstname() {
    return this.contactForm.get('firstname');
  }

  get lastname() {
    return this.contactForm.get('lastname');
  }

  get phoneNumber() {
    return this.contactForm.get('phoneNumber');
  }

  get dni() {
    return this.contactForm.get('dni');
  }

  get cuit() {
    return this.contactForm.get('cuit');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get isEmpowered() {
    return this.contactForm.get('isEmpowered');
  }

  public errorMessages = {
    firstname: [
      {
        type: 'required',
        message:
          'Por favor, ingrese su nombre, es necesario para completar el registro.',
      },
    ],
    lastname: [
      {
        type: 'required',
        message:
          'Por favor, ingrese su apellido, es necesario para completar el registro.',
      },
    ],
    email: [
      {
        type: 'required',
        message:
          'Por favor, ingrese su correo electrónico, es necesario para completar el registro.',
      },
      {
        type: 'pattern',
        message: 'Por favor, ingrese un correo electrónico válido',
      },
    ],
  };

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.activatedRoute.snapshot.params['id']) {
      this.userService
        .getUsersByUserId(this.activatedRoute.snapshot.params['id'])
        .subscribe((resp: any) => {
          this.multimediaList = resp.multimedias;
          this.firstname.setValue(resp.firstname);
          this.lastname.setValue(resp.lastname);
          this.dni.setValue(resp.dni);
          this.cuit.setValue(resp.cuit);
          this.phoneNumber.setValue(resp.phoneNumber);
          this.email.setValue(resp.email);
          this.isEmpowered.setValue(resp.multimedias.length > 0);
          this.contactUser.user = resp.user2;
          this.contactUser.id = resp.id;
        });
    }
  }

  compararPorId(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  search() {
    if (!this.contactUser.id) {
      const val = this.email.value;
      if (!!val && val.trim() !== '') {
        this.doSearch(val);
      } else {
        this.contactUser.user = {};
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  async selectAndUploadFiles(event: any) {
    if (event.target.files) {
      await this.uploadMultimedia(event.target.files);
    }
  }

  private async uploadMultimedia(files: FileList) {
    if (!!files && files.length > 0) {
      const file = files[0];
      const sizeMax = 5 * 1024 * 1024;
      if (file.size > sizeMax) {
        this.globalService.showToast(
          'El tamaño de la imagen no puede ser superior a 5mb',
          'danger'
        );
        return;
      }
      let loadingSplash = this.loadingCtrl.create({
        message: 'Por favor espere...',
      });
      await (await loadingSplash).present();
      const fileName = file.name;
      this.multimediaService.getUploadSignedUrl(fileName).subscribe(
        async (presign: any) => {
          this.multimediaService.uploadFile(presign.data, files).subscribe(
            async (fileResp) => {
              this.multimediaList.push({
                fileName: fileName,
                key: presign.key,
              });
              (await loadingSplash).dismiss();
            },
            async (err: any) => {
              (await loadingSplash).dismiss();
              console.error(err);
            }
          );
        },
        async (err: any) => {
          (await loadingSplash).dismiss();
          console.error(err);
        }
      );
    }
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

  removeMultimedia(m) {
    alert('en construccion...');
  }

  async saveContact() {
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });
    await (await loadingSplash).present();
    this.wait = true;
    this.userService
      .saveUsersByUsers(this.contactUser.id, {
        firstname: this.firstname.value,
        lastname: this.lastname.value,
        email: this.email.value,
        dni: this.dni.value,
        phoneNumber: this.phoneNumber.value,
        cuit: this.cuit.value,
        isEmpowered: this.isEmpowered.value,
        multimedias: this.multimediaList,
      })
      .subscribe(
        async () => {
          this.wait = false;
          this.globalService.showToast(
            'El contacto se creo con éxito',
            'success'
          );
          this.router.navigate(['/contacts']);
          (await loadingSplash).dismiss();
        },
        async (data: any) => {
          this.wait = false;
          (await loadingSplash).dismiss();
          this.globalService.showToast(`${data.error.message}`, 'danger');
        }
      );
  }

  canSubmit() {
    return (
      !!this.firstname.value &&
      !!this.lastname.value &&
      !!this.email.value &&
      this.lastname.value.trim() !== '' &&
      this.firstname.value.trim() !== '' &&
      this.email.value.trim() !== ''
    );
  }

  cancelForm() {
    this.contactForm.reset();
    this.router.navigate(['/contacts']);
  }

  private doSearch(text: string | null) {
    this.wait = true;
    this.userService.searchUsers(text).subscribe(
      (resp: any) => {
        if (!!resp && !!resp.data && resp.data.length > 0) {
          this.contactUser.user = resp.data[0];
          this.firstname.setValue(this.contactUser.user.firstname);
          this.lastname.setValue(this.contactUser.user.lastname);
          this.email.setValue(this.contactUser.user.email);
          this.dni.setValue(this.contactUser.user.dni);
          this.cuit.setValue(this.contactUser.user.cuit);
          this.phoneNumber.setValue(this.contactUser.user.phoneNumber);
          console.log(this.contactUser.user);
          this.globalService.showToast(
            `El usuario existe y puedes modificar sus datos pero impacta únicamente en tu agenda`,
            'success'
          );
        }
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      }
    );
  }
}
