import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { UserAdminService } from '../services/user-admin.service';
import { UserTypeService } from '../services/user-type.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  wait = false;
  banEmailValidate = false;
  userTypes: any[] = [];
  userTypeSelected: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private userAdminService: UserAdminService,
    private router: Router,
    private userTypeService: UserTypeService,
    private globalService: GlobalService
  ) {}

  userForm = this.formBuilder.group({
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
    dni: ['', []],
    cuit: ['', []],
    phoneNumber: ['', []],
  });

  get userType() {
    return this.userForm.get('userType');
  }

  get firstName() {
    return this.userForm.get('firstName');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get phoneNumber() {
    return this.userForm.get('phoneNumber');
  }

  get dni() {
    return this.userForm.get('dni');
  }

  get cuit() {
    return this.userForm.get('cuit');
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
      {
        type: 'pattern',
        message: 'Por favor, ingrese un correo electrónico válido',
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
    this.userTypes = [];
    this.userTypeService.getAllUserTypes().subscribe((resp: any) => {
      for (let type of resp.data) {
        this.userTypes.push(type);
        this.userTypeSelected = type;
      }
    });
  }

  compararPorId(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  save() {
    this.wait = true;
    const data = {
      lastname: this.lastName.value,
      firstname: this.firstName.value,
      email: this.email.value,
      dni: this.dni.value,
      cuit: this.cuit.value,
      phoneNumber: this.phoneNumber.value,
      userTypeId: this.userType.value.id,
    };
    this.userAdminService.createUser({ ...data }).subscribe(
      async (resp: any) => {
        this.wait = false;
        this.globalService.showToast(
          'El nuevo usuario fue notificado a su email.'
        );
        this.goHome();
      },
      async (err: any) => {
        this.wait = false;
        this.globalService.showToast(`${err.error.message}`);
      }
    );
  }

  goHome() {
    this.router.navigate(['users/lists']);
  }
}
