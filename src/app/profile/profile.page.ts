import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { UserTypeService } from '../services/user-type.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  wait = false;
  banEmailValidate = false;
  userTypes: any[] = [];
  userTypeSelected: any = {};

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    private router: Router,
    private userTypeService: UserTypeService,
    private globalService: GlobalService,
    private loadingCtrl: LoadingController
  ) {}

  profileForm = this.formBuilder.group(
    {
      userType: ['', []],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          Validators.required,
        ],
      ],
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
      dni: ['', []],
      cuit: ['', []],
      phoneNumber: ['', []],
      publicData: [false, [Validators.required]],
      emailValidated: [false, [Validators.required]],
      recoverpassword: ['', []],
    },
    { validator: this.passwordConfirming }
  );

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmpassword').value) {
      return { invalid: true };
    }
  }

  get userType() {
    return this.profileForm.get('userType');
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }

  get publicData() {
    return this.profileForm.get('publicData');
  }

  get emailValidated() {
    return this.profileForm.get('emailValidated');
  }

  get password() {
    return this.profileForm.get('password');
  }

  get confirmpassword() {
    return this.profileForm.get('confirmpassword');
  }

  get dni() {
    return this.profileForm.get('dni');
  }

  get cuit() {
    return this.profileForm.get('cuit');
  }

  get recoverpassword() {
    return this.profileForm.get('recoverpassword');
  }

  public errorMessages = {
    firstName: [
      {
        type: 'required',
        message:
          'Por favor, ingrese su nombre, es necesario para completar el registro.',
      },
    ],
    lastName: [
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
    ],
    password: [
      {
        type: 'required',
        message:
          'Por favor, ingrese un contraseña, es necesaria para completar el registro.',
      },
    ],
    confirmpassword: [
      {
        type: 'required',
        message:
          'Por favor, confirme su contraseña, es necesaria para completar el registro.',
      },
    ],
    isLawyer: [
      {
        type: 'required',
        message: 'Por favor, indique si usted es abogado o no.',
      },
    ],
  };

  ngOnInit() {}

  ionViewWillEnter() {
    this.banEmailValidate = false;

    this.userTypeService.getAllUserTypes().subscribe((resp: any) => {
      this.userTypes = [];
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].id != 3) {
          // abogado no se muestra
          this.userTypes.push(resp.data[i]);
          this.userTypeSelected = resp.data[i];
        }
      }
      const idx = this.userTypes.findIndex((ut: any) => {
        return ut.alias === 'company';
      });
    });

    this.userService.getUserByToken().subscribe((res: any) => {
      this.userType.setValue(res.data.userType);
      this.userTypeSelected = res.data.userType;
      this.lastName.setValue(res.data.lastname);
      this.firstName.setValue(res.data.firstname);
      this.dni.setValue(res.data.dni);
      this.cuit.setValue(res.data.cuit);
      this.email.setValue(res.data.email);
      this.phoneNumber.setValue(res.data.phoneNumber);
      this.publicData.setValue(res.data.publicData);
      this.emailValidated.setValue(res.data.emailValidated);
    });
  }

  compararPorId(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  logout() {
    this.userService.logout();
  }

  async recoverPassword() {
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });

    await (await loadingSplash).present();

    this.userService.recoverPassword({ email: this.email.value }).subscribe(
      async (data: { user: any; token: string }) => {
        (await loadingSplash).dismiss();

        this.globalService.showToast(
          'Para cambiar su contraseña verifique el e-email enviado. No olvide revisar casilla de SPAM.'
        );
      },
      async (err) => {
        if (err.error.message) {
          this.globalService.showToast(`${err.error.message}`);
        } else {
          this.globalService.showToast(`${err.message}`);
        }
        (await loadingSplash).dismiss();
      }
    );
  }

  validateEmail() {
    this.wait = true;
    // primero guarda los datos
    this.userService
      .saveProfile({
        id: this.userService.getUser().id,
        email: this.email.value,
      })
      .subscribe(
        async (resp: any) => {
          // envia el codigo
          this.userService
            .emailValidate({
              id: this.userService.getUser().id,
              email: this.email.value,
              recoverpassword: this.recoverpassword.value,
            })
            .subscribe(
              async (resp: any) => {
                this.wait = false;
                this.banEmailValidate = false;
                this.globalService.showToast('Datos actualizados');
                let userUpdated = this.userService.getUser();
                userUpdated.email = resp.email;
                userUpdated.emailValidated = resp.emailValidated;
                this.emailValidated.setValue(userUpdated.emailValidated);
                this.userService.saveUserLogged(
                  userUpdated,
                  this.userService.getToken()
                );
              },
              async (err: any) => {
                this.wait = false;
                if (err.error && err.error.error == 'validateEmail') {
                  this.banEmailValidate = true;
                  this.recoverpassword.setValue('');
                }
                this.globalService.showToast(`${err.error.message}`);
              }
            );
        },
        async (err: any) => {
          this.wait = false;
          this.globalService.showToast(`${err.error.message}`);
        }
      );
  }

  save() {
    this.wait = true;
    let userUpdated = {
      id: this.userService.getUser().id,
      lastname: this.lastName.value,
      firstname: this.firstName.value,
      dni: this.dni.value,
      cuit: this.cuit.value,
      email: this.email.value,
      phoneNumber: this.phoneNumber.value,
      publicData: this.publicData.value,
    };
    this.userService.saveProfile(userUpdated).subscribe(
      async (resp: any) => {
        this.wait = false;
        this.globalService.showToast('Datos actualizados');
        this.userService.saveUserLogged(resp, this.userService.getToken());
      },
      async (err: any) => {
        this.wait = false;
        this.globalService.showToast(`${err.error.message}`);
      }
    );
  }

  goHome() {
    this.router.navigate(['']);
  }
}
