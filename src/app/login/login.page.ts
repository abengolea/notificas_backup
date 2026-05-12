import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { Md5 } from 'ts-md5';
import { GlobalService } from '../services/global.service';
import { MaintenanceAlertService } from '../services/maintenance-alert.service';
import { UserTypeService } from '../services/user-type.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  registro = false;
  recover = false;
  recoverpasswordValue = '';
  banRecoverpassword = false;
  userTypes: any[] = [];
  userTypeSelected: any = null;

  registroForm = this.formBuilder.group(
    {
      userType: ['', [Validators.required]],
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
      isLawyer: [true, [Validators.required]],
      recoverpassword: ['', []],
    },
    { validator: this.passwordConfirming }
  );

  recoverForm = this.formBuilder.group(
    {
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
    },
    { validator: this.passwordConfirming }
  );

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmpassword').value) {
      return { invalid: true };
    }
  }

  get userType() {
    return this.registroForm.get('userType');
  }
  get firstName() {
    return this.registroForm.get('firstName');
  }

  get lastName() {
    return this.registroForm.get('lastName');
  }

  get email() {
    return this.registroForm.get('email');
  }

  get password() {
    return this.registroForm.get('password');
  }

  get confirmpassword() {
    return this.registroForm.get('confirmpassword');
  }

  get isLawyer() {
    return this.registroForm.get('isLawyer');
  }

  get recoverpassword() {
    return this.registroForm.get('recoverpassword');
  }

  get passwordRecover() {
    return this.recoverForm.get('password');
  }

  get confirmpasswordRecover() {
    return this.recoverForm.get('confirmpassword');
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

  constructor(
    private menu: MenuController,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userTypeService: UserTypeService,
    private userService: UserService,
    private maintenanceAlert: MaintenanceAlertService
  ) {
    console.log('entra');
    if (this.activatedRoute.snapshot.params['recoverpassword']) {
      this.recover = true;
      this.recoverpasswordValue =
        this.activatedRoute.snapshot.params['recoverpassword'];
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.menu.enable(false);

    this.userTypeService.getAllUserTypes().subscribe((resp: any) => {
      this.userTypes = [];
      for (let i = 0; i < resp.data.length; i++) {
        if (resp.data[i].id != 3) {
          // abogado no se muestra
          this.userTypes.push(resp.data[i]);
        }
      }
      const idx = this.userTypes.findIndex((ut: any) => {
        return ut.alias === 'company';
      });
    });
  }

  wait = false;
  async signIn() {
    if (this.maintenanceAlert.isMaintenanceBlocked) {
      await this.maintenanceAlert.present();
      return;
    }
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });

    await (await loadingSplash).present();
    if (this.registroForm.valid && !this.wait) {
      let recoverpassword = '';
      if (this.recoverpassword) {
        recoverpassword = this.recoverpassword.value;
      }
      this.userService
        .signIn({
          firstname: this.firstName.value,
          lastname: this.lastName.value,
          email: this.email.value,
          password: Md5.hashStr(this.password.value).toString(),
          isLawyer: this.isLawyer.value,
          recoverpassword: recoverpassword,
        })
        .subscribe(
          async (resp: any) => {
            this.wait = false;
            (await loadingSplash).dismiss();
            this.globalService.showToast(
              'Registro exitoso, ya puede ingresar a Notificas.'
            );
            this.registro = false;
            this.loginData.email = this.email.value;
            this.registroForm.reset();
          },
          async (err: any) => {
            (await loadingSplash).dismiss();
            this.wait = false;
            if (err.error && err.error.error == 'validateEmail') {
              this.banRecoverpassword = true;
              this.globalService.showToast(`${err.error.message}`);
            } else {
              this.globalService.showToast(
                `Hubo un error al registrarse. ${err.error.message}`
              );
            }
          }
        );
    }
  }

  loginData = {
    email: '',
    password: '',
  };

  compararPorId = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  async login() {
    if (this.maintenanceAlert.isMaintenanceBlocked) {
      await this.maintenanceAlert.present();
      return;
    }
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });

    await (await loadingSplash).present();

    this.userService
      .login({ email: this.loginData.email, password: this.loginData.password })
      .subscribe(
        async (data: { user: any; token: string }) => {
          (await loadingSplash).dismiss();
          this.userService.saveUserLogged(data.user, data.token);
          this.router.navigate(['/']);
        },
        async (err) => {
          console.log(err);
          if (err.error.message) {
            this.globalService.showToast(`${err.error.message}`);
          } else {
            this.globalService.showToast(`${err.message}`);
          }
          (await loadingSplash).dismiss();
        }
      );
  }

  async recoverPassword() {
    if (this.maintenanceAlert.isMaintenanceBlocked) {
      await this.maintenanceAlert.present();
      return;
    }
    if (this.loginData.email == '') {
      this.globalService.showToast('Ingrese el e-mail.');
    } else {
      let loadingSplash = this.loadingCtrl.create({
        message: 'Por favor espere...',
      });

      await (await loadingSplash).present();

      this.userService
        .recoverPassword({ email: this.loginData.email })
        .subscribe(
          async (data: { user: any; token: string }) => {
            (await loadingSplash).dismiss();

            this.globalService.showToast(
              'Se ha enviado un e-email. No olvide revisar casilla de SPAM.'
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
  }

  async changePassword() {
    if (this.maintenanceAlert.isMaintenanceBlocked) {
      await this.maintenanceAlert.present();
      return;
    }
    let loadingSplash = this.loadingCtrl.create({
      message: 'Por favor espere...',
    });

    await (await loadingSplash).present();

    if (this.recoverForm.valid && !this.wait) {
      this.userService
        .changePassword({
          password: Md5.hashStr(this.passwordRecover.value).toString(),
          recoverpassword: this.recoverpasswordValue,
        })
        .subscribe(
          async (resp: any) => {
            this.wait = false;
            (await loadingSplash).dismiss();
            this.globalService.showToast(
              'Cambio de contraseña exitoso, ya puede ingresar a Notificas con su nueva contraseña.'
            );
            this.recover = false;
          },
          async (err: any) => {
            console.error(err);
            (await loadingSplash).dismiss();
            this.globalService.showToast(
              `Se produjo un error: ${err.error.message}`
            );
            this.wait = false;
          }
        );
    } else {
      this.wait = false;
    }
  }

  contacto() {
    window.location.href =
      'mailto:contacto@notificas.com?subject=Persona Jurídica';
  }
}
