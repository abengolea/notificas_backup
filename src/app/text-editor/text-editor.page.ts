import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { GlobalService } from '../services/global.service';
import { UserTypeService } from '../services/user-type.service';
import { DocumentService } from '../services/document.service';
import { DocumentTypeService } from '../services/document-type.service';
import { TransactionTypeService } from '../services/transaction-type.service';
import { ProofService } from '../services/proof.service';
import { MultimediaService } from '../services/multimedia.service';
import { DocumentTemplateService } from '../services/document-template.service';

import sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.page.html',
  styleUrls: ['./text-editor.page.scss'],
})
export class TextEditorPage implements OnInit, OnDestroy {
  @ViewChild('destinationComponent')
  destinationComponent: IonicSelectableComponent;
  @ViewChild('senderComponent') senderComponent: IonicSelectableComponent;
  usersSubscription: Subscription;
  documentTypesSubscription: Subscription;
  userTypeSelected = null;
  userLogin = null;
  wait = false;
  document: any = {
    subject: null,
    body: '',
    senderSelected: null,
    destinationSelected: [],
    senderType: 'personal',
    total: 0,
  };
  documentTypes: any[] = [];
  allDocumentTypes: any[] = [];
  userTypes: any[] = [];
  userList: any[] = [];
  destionationUserForm: FormGroup;
  senderUserForm: FormGroup;
  transactionstypes: any[] = [];
  multimediaList: any[];
  senderLegalrepresentativeSelected: any = {};
  errorMessages = {
    lastname: [{ type: 'required', message: 'Se requiere un apellido' }],
    firstname: [{ type: 'required', message: 'Se requiere un nombre' }],
    email: [
      { type: 'required', message: 'Se requiere un email' },
      { type: 'pattern', message: 'Por favor, introduce un email válido' },
    ],
  };
  configCKEditor: any = {
    toolbar: [
      ['Bold', 'Italic', 'Underline'],
      ['RemoveFormat', 'NumberedList', 'BulletedList'],
      ['FontSize', 'TextColor', 'BGColor'],
    ],
  };
  isTypeReply: boolean;
  templates: any[] = [];

  radioShow: boolean;

  private readonly _unsubscribe$ = new Subject<any>();

  constructor(
    private multimediaService: MultimediaService,
    private documentTypeService: DocumentTypeService,
    private documentService: DocumentService,
    private userService: UserService,
    private userTypeService: UserTypeService,
    private transactionsTypeService: TransactionTypeService,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private proofService: ProofService,
    private documentTemplateService: DocumentTemplateService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscribe$.next('destroy');
    this._unsubscribe$.complete();
  }

  prepararForm(formGroup) {
    this.destionationUserForm = formGroup;
    this.senderUserForm = formGroup;
  }

  ionViewDidLeave() {}

  ionViewWillEnter() {
    //TODO call service to see type of [ (userstypes_id=3 OR userstypes_id=4) to show or not checkbox]
    this.userService
      .getUserType(this.userService.getUser().id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: any) => {
        this.radioShow = data;
      });

    this.senderLegalrepresentativeSelected = {};
    this.userLogin = this.userService.getUser();
    this.isTypeReply = false;
    this.multimediaList = [];
    if (!!this.documentTypesSubscription) {
      this.documentTypesSubscription.unsubscribe();
    }
    this.documentTypesSubscription = this.documentTypeService
      .getAllDocumentTypes()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((docTypes: any) => {
        this.documentTypes = docTypes.data;
        this.allDocumentTypes = [...docTypes.data];
      });
    this.documentTypesSubscription.add(() => {
      this.initData();
    });

    this.documentTemplateService
      .getDocumentTemplates('')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res: any) => {
        this.templates = res.data;
      });
  }

  async initData() {
    const formGroup = this.formBuilder.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      dni: ['', []],
      cuit: ['', []],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      phoneNumber: ['', []],
      userType: ['', [Validators.required]],
      dataPublic: ['', []],
    });

    this.prepararForm(formGroup);

    this.document.senderSelected = this.userService.getUser();
    this.userTypeService
      .getAllUserTypes()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((resp: any) => {
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
    if (this.activatedRoute.snapshot.params['uuid']) {
      await this.globalService.presentLoading();
      this.wait = true;

      // si edita busca segun el uuid
      this.documentService
        .getDocumentsByUUID(this.activatedRoute.snapshot.params['uuid'])
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: async (resp: any) => {
            this.wait = false;
            await this.globalService.stopLoading();
            if (resp.data) {
              this.document = resp.data;

              //carga los archivos multimedia
              this.documentService
                .getDocumentMultimedia(this.document.id)
                .subscribe((respMulti: any) => {
                  this.multimediaList = respMulti.data;
                });

              // recorre los usuario para llenar el sender y destinations
              this.document.destinationSelected = [];
              for (let du of this.document.documentUsers) {
                if (du.documentUserType.id == 3) {
                  // sender
                  this.document.senderSelected = du.user;
                } else if (du.documentUserType.id == 4) {
                  // destination
                  this.document.destinationSelected.push(du.user);
                } else if (du.documentUserType.id == 5) {
                  // represented
                  this.senderLegalrepresentativeSelected = du.user;
                }
              }

              // enganchar al API de transactions types utilizados en documentos
              this.transactionsTypeService
                .getDocumentsByDocumentstype(this.document.documentType.id)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((respDT: any) => {
                  // los recorre si son required lo pone en true
                  for (let i = 0; i < respDT.data.length; i++) {
                    respDT.data[i].checked = false;
                    if (respDT.data[i].required) {
                      respDT.data[i].checked = true;
                    }
                  }

                  this.transactionstypes = respDT.data;

                  // se asigna el total
                  this.totalCoins();
                });
            } else {
              await this.globalService.showToast(
                'Documento no existente',
                'warning'
              );
              this.router.navigate(['/']);
            }
          },
          error: async () => {
            await this.globalService.showToast(
              'Documento no existente',
              'warning'
            );
            this.wait = false;
            await this.globalService.stopLoading();
            this.router.navigate(['/']);
          },
        });
    } else if (this.activatedRoute.snapshot.params['respuuid']) {
      this.initResponse();
    } else {
      let id: number | null = null;
      if (this.activatedRoute.snapshot.params['documentstype_id']) {
        id = this.activatedRoute.snapshot.params['documentstype_id'];
      } else {
        //todo buscar por alias en los estados
        id = 5; // notificacion
      }
      const idx = this.allDocumentTypes.findIndex((docType: any) => {
        return docType.id === id;
      });

      this.document.documentType =
        idx !== -1 ? this.allDocumentTypes[idx] : null;

      this.document.subject = this.document.documentType.name + ' - '; // Default Subject suggestion
      // enganchar al API de transactions types utilizados en documentos
      this.transactionsTypeService
        .getDocumentsByDocumentstype(id)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((respDT: any) => {
          // los recorre si son required lo pone en true
          for (let i = 0; i < respDT.data.length; i++) {
            respDT.data[i].checked = false;
            if (respDT.data[i].required) {
              respDT.data[i].checked = true;
            }
          }

          this.transactionstypes = respDT.data;

          // se asigna el total
          this.totalCoins();
        });
    }
  }

  get lastname() {
    return this.destionationUserForm.get('lastname');
  }

  get firstname() {
    return this.destionationUserForm.get('firstname');
  }

  get dni() {
    return this.destionationUserForm.get('dni');
  }

  get cuit() {
    return this.destionationUserForm.get('cuit');
  }

  get phoneNumber() {
    return this.destionationUserForm.get('phoneNumber');
  }

  get email() {
    return this.destionationUserForm.get('email');
  }

  get userType() {
    return this.destionationUserForm.get('userType');
  }

  get lastnameSender() {
    return this.senderUserForm.get('lastname');
  }

  get firstnameSender() {
    return this.senderUserForm.get('firstname');
  }

  get cuilSender() {
    return this.senderUserForm.get('cuil');
  }

  get phoneNumberSender() {
    return this.senderUserForm.get('phoneNumber');
  }

  get emailSender() {
    return this.senderUserForm.get('email');
  }

  get userTypeSender() {
    return this.senderUserForm.get('userType');
  }

  async removeMultimedia(m) {
    await this.globalService.presentLoading('Por favor espere...');
    this.multimediaService
      .deleteMultimedia(m.key, this.document.id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: async () => {
          this.documentService
            .getDocumentMultimedia(this.document.id)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
              next: async (respMulti: any) => {
                this.multimediaList = respMulti.data;
                await this.globalService.stopLoading();
              },
              error: async (err: any) => {
                await this.globalService.stopLoading();
                console.error(err);
              },
            });
        },
        error: async (err: any) => {
          await this.globalService.stopLoading();
          console.error(err);
        },
      });
  }

  goProfile() {
    this.saveDraftDocument(true);
    this.router.navigate(['/profile']);
  }

  verificarCambioTipoRemitente() {
    if (this.document.senderType == 'personal') {
      this.document.senderSelected = this.userService.getUser();
    }
  }

  async checkAttachments($event) {
    if ($event.value.multimedias.length == 0) {
      await this.globalService.showToast(
        'No se ha adjuntado el poder, debe adjuntarlo desde contactos!',
        'danger'
      );
      this.senderLegalrepresentativeSelected = {};
    } else {
      for (let i = 0; i < $event.value.multimedias.length; i++) {
        // primero descarga el archivo para luego copiarlo y subirlo para adjuntarlo al envio
        this.multimediaService
          .getDownloadSignedUrl($event.value.multimedias[i].key)
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe(async (resp: any) => {
            let response = await fetch(resp.url);
            let data = await response.blob();
            let file = new File([data], $event.value.multimedias[i].fileName);
            this.uploadMultimedia(this.createFileList([file]));
          });
      }
    }
  }

  createFileList = (files: Array<File>): FileList => {
    return {
      length: files.length,
      item: (index: number) => files[index],
      *[Symbol.iterator]() {
        for (let i = 0; i < files.length; i++) {
          yield files[i];
        }
      },
      ...files,
    };
  };

  async selectAndUploadFiles(event: any) {
    if (event.target.files) {
      await this.uploadMultimedia(event.target.files);
    }
  }

  async saveDraftDocument(saveBackground?) {
    await this.globalService.presentLoading('Por favor espere...');
    if (!saveBackground) {
      await this.globalService.stopLoading();
    }

    if (this.canCreateDocument() && !this.wait) {
      let senderUserRepresentedIds = [];
      if (
        this.senderLegalrepresentativeSelected &&
        this.senderLegalrepresentativeSelected.id
      ) {
        senderUserRepresentedIds.push(
          this.senderLegalrepresentativeSelected.id
        );
      }

      this.wait = true;
      const data: any = {
        senderType: this.document.senderType,
        subject: this.document.subject,
        body: this.document.body,
        senderUserIds: [this.document.senderSelected.id],
        destinationUserIds: this.getDestinationToSent(),
        documentTypeId: this.document.documentType.id,
        documentStatusId: 1,
        multimedias: this.multimediaList,
        senderUserRepresentedIds: senderUserRepresentedIds,
      };
      if (this.document.id) {
        data.id = this.document.id;
      }
      this.documentService
        .saveDocument(data)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: async () => {
            this.globalService.stopLoading();
            this.wait = false;
            let msj = 'El documento se guardo como borrador con éxito';
            if (saveBackground) {
              msj = 'El documento se ha auto-guardado como borrador';
            }
            await this.globalService.showToast(msj, 'success');

            if (!saveBackground) {
              this.router.navigate(['/']);
            }
          },
          error: async (data) => {
            this.globalService.stopLoading();
            await this.globalService.showToast(
              `Hubo un error al guardar el documento. Mensaje: ${
                data.error.message || ''
              }`,
              'danger'
            );
            this.wait = false;
          },
        });
    }
  }

  async saveDraftDocumentTEST(saveBackground?) {
    await this.globalService.presentLoading('Por favor espere...');
    if (!saveBackground) {
      await this.globalService.stopLoading();
    }

    if (this.canCreateDocument() && !this.wait) {
      let senderUserRepresentedIds = [];
      if (
        this.senderLegalrepresentativeSelected &&
        this.senderLegalrepresentativeSelected.id
      ) {
        senderUserRepresentedIds.push(
          this.senderLegalrepresentativeSelected.id
        );
      }

      this.wait = true;
      const dataChanged: any = {
        senderType: 'personal',
        subject: this.document.subject,
        body: this.document.body,
        senderUserIds: [this.document.destinationSelected[0].id],
        destinationUserIds: [this.document.destinationSelected[1].id],
        documentTypeId: this.document.documentType.id,
        documentStatusId: 1,
        multimedias: this.multimediaList,
        senderUserRepresentedIds: senderUserRepresentedIds,
      };

      if (this.document.id) {
        dataChanged.id = this.document.id;
      }
      const userSponser = {
        id: this.document.destinationSelected[0].id,
        email: this.document.destinationSelected[0].email,
        userGroup: { id: 2, name: 'Usuarios' },
      };

      const userSponserFinalDestination = {
        id: this.document.destinationSelected[1].id,
        email: this.document.destinationSelected[1].email,
        userGroup: { id: 2, name: 'Usuarios' },
      };

      console.log(dataChanged);
      console.log(userSponser);
      console.log(userSponserFinalDestination);

      this.documentService
        .saveDocumentSponsoring(dataChanged, userSponser)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: async () => {
            this.globalService.stopLoading();
            this.wait = false;
            let msj = 'El documento se guardo como borrador con éxito';
            if (saveBackground) {
              msj = 'El documento se ha auto-guardado como borrador';
            }
            await this.globalService.showToast(msj, 'success');

            if (!saveBackground) {
              this.router.navigate(['/']);
            }
          },
          error: async (data) => {
            this.globalService.stopLoading();
            await this.globalService.showToast(
              `Hubo un error al guardar el documento. Mensaje: ${
                data.error.message || ''
              }`,
              'danger'
            );
            this.wait = false;
          },
        });
    }
  }

  async sendDocument() {
    if (this.wait) {
      return null;
    }

    if (this.isTypeReply) {
      this.sendResponseDocument();
    } else {
      await this.globalService.presentLoading('Por favor espere...');

      if (this.canCreateDocument() && !this.wait) {
        let senderUserRepresentedIds = [];
        if (
          this.senderLegalrepresentativeSelected &&
          this.senderLegalrepresentativeSelected.id
        ) {
          senderUserRepresentedIds.push(
            this.senderLegalrepresentativeSelected.id
          );
        }

        this.wait = true;
        const data: any = {
          senderType: this.document.senderType,
          subject: this.document.subject,
          body: this.document.body,
          senderUserIds: [this.document.senderSelected.id],
          destinationUserIds: this.getDestinationToSent(),
          documentTypeId: this.document.documentType.id,
          documentStatusId: 2,
          transactionstypes: this.transactionstypes,
          total: this.document.total,
          multimedias: this.multimediaList,
          senderUserRepresentedIds: senderUserRepresentedIds,
        };
        if (this.document.id) {
          data.id = this.document.id;
        }
        this.documentService
          .saveDocument(data)
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe({
            next: async () => {
              await this.globalService.showToast(
                'El documento se ha enviado con éxito',
                'success'
              );
              await this.globalService.stopLoading();
              this.wait = false;
              this.router.navigate(['/']);

              // refresca el valor de balance coins
              this.proofService.refreshBalanceCoins();
            },
            error: async (data) => {
              await this.globalService.showToast(
                `Hubo un error al guardar el documento. Mensaje: ${
                  data.error.message || ''
                }`,
                'danger'
              );
              this.wait = false;
              await this.globalService.stopLoading();
            },
          });
      }
    }
  }

  cancelSend() {
    this.router.navigate(['/']);
  }

  canCreateDocument() {
    return (
      !!this.document.senderSelected &&
      !!this.document.subject &&
      !!this.document.body &&
      this.document.destinationSelected.length > 0
    );
  }

  compararPorId(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  onSaveDestination(event: any) {
    if (event.item) {
      // Fill form.
      this.lastname.setValue(event.item.lastname);
      this.firstname.setValue(event.item.firstname);
      this.dni.setValue(event.item.dni);
      this.cuit.setValue(event.item.cuit);
      this.email.setValue(event.item.email);
      this.phoneNumber.setValue(event.item.phoneNumber);
      this.userType.setValue({ id: parseInt(event.item.userType.id) });
      this.userTypeSelected = { id: parseInt(event.item.userType.id) };
    } else {
      this.destionationUserForm.reset();
      this.senderUserForm.reset();
    }
    // Show form.
    event.component.showAddItemTemplate();
  }

  removeDestination(u) {
    let aux: any = [];
    // debe recorrer el array y quitarlo
    let destinationsSel = this.document.destinationSelected;

    for (let i = 0; i < destinationsSel.length; i++) {
      if (destinationsSel[i].id != u.id) {
        aux.push(destinationsSel[i]);
      }
    }

    this.document.destinationSelected = aux;
  }

  documentTypeChange(event: any) {
    this.listTransactionsTypes(this.document.documentType.id);
    this.document.subject = this.document.documentType.name + ' - ';
  }

  searchDocumentType(event: {
    component: IonicSelectableComponent;
    text: string;
  }) {
    const text = !!event.text ? event.text.trim() : null;
    if (!!text && text !== '') {
      event.component.startSearch();
      const newItems = this.allDocumentTypes.filter((docType: any) => {
        return (
          !!docType &&
          !!docType.name &&
          docType.name.toLowercase.includes(text.toLowerCase())
        );
      });
      event.component.items = newItems;
    } else {
      event.component.items = [...this.allDocumentTypes];
    }
    event.component.endSearch();
  }

  searchUsers(
    event: { component: IonicSelectableComponent; text: string },
    withAttachments?
  ) {
    if (!!this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    const text = !!event.text ? event.text.trim() : null;
    if (!!text && text !== '') {
      event.component.startSearch();
      this.usersSubscription = this.userService
        .searchUsers(text, withAttachments)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((resp: any) => {
          event.component.items = resp.data;
          event.component.endSearch();
        });
    } else {
      event.component.items = [];
      event.component.endSearch();
    }
  }

  cancel() {
    this.destionationUserForm.reset();
    this.destinationComponent.hideAddItemTemplate();
  }

  cancelSenderForm() {
    this.senderUserForm.reset();
    this.senderComponent.hideAddItemTemplate();
  }

  submitUser() {
    if (this.destionationUserForm.valid) {
      this.destinationComponent.showLoading();
      this.wait = true;
      const data = {
        lastname: this.lastname.value,
        firstname: this.firstname.value,
        email: this.email.value,
        dni: this.dni.value,
        cuit: this.cuit.value,
        userTypeId: this.userType.value.id,
        phoneNumber: this.phoneNumber.value,
      };
      this.userService
        .createUser({ ...data })
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: (resp: any) => {
            this.destinationComponent.search(resp.lastname);
            this.usersSubscription.add(async () => {
              // Clean form.
              this.destionationUserForm.reset();
              this.destinationComponent.hideAddItemTemplate();
              this.wait = false;
              await this.globalService.showToast(
                'El destinatario se guardo con exito',
                'success'
              );
            });
          },
          error: async (res: any) => {
            console.error(res);
            await this.globalService.showToast(
              `El destinatario no se pudo guardar. ${res.error.message}`,
              'danger'
            );
            this.wait = false;
          },
        });
    }
  }

  submitUserSender() {
    if (this.senderUserForm.valid) {
      this.senderComponent.showLoading();
      this.wait = true;
      const data = {
        lastname: this.lastnameSender.value,
        firstname: this.firstnameSender.value,
        email: this.emailSender.value,
        dni: this.cuilSender.value,
        phoneNumber: this.phoneNumberSender.value,
        userTypeId: this.userTypeSender.value.id,
      };
      this.userService
        .createUser({ ...data })
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: async (resp: any) => {
            this.senderComponent.search(resp.lastname);
            this.usersSubscription.add(async () => {
              // Clean form.
              this.senderUserForm.reset();
              this.senderComponent.hideAddItemTemplate();
              this.wait = false;
              await this.globalService.showToast(
                'El remitente se guardo con éxito',
                'success'
              );
            });
          },
          error: async (res: any) => {
            await this.globalService.showToast(
              `El remitente no se pudo guardar. ${res.error.message || ''}`,
              'danger'
            );
            this.wait = false;
          },
        });
    }
  }

  totalCoins() {
    // se recorren todos los transactionstypes
    let total = 0;
    for (let i = 0; i < this.transactionstypes.length; i++) {
      if (this.transactionstypes[i].checked) {
        total += this.transactionstypes[i].total;
      }
    }
    this.document.total = total;
  }

  private getDestinationToSent(): string[] {
    const ids: string[] = [];
    for (const sender of this.document.destinationSelected) {
      ids.push(sender.id);
    }
    return ids;
  }

  private async uploadMultimedia(files: FileList) {
    if (!!files && files.length > 0) {
      const file = files[0];
      const sizeMax = 10 * 1024 * 1024;
      if (file.size > sizeMax) {
        await this.globalService.showToast(
          'El tamaño de la imagen no puede ser superior a 10mb',
          'danger'
        );
        return;
      }
      await this.globalService.presentLoading('Por favor espere...');
      const fileName = file.name;
      this.multimediaService
        .getUploadSignedUrl(fileName)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: async (presign: any) => {
            this.multimediaService
              .uploadFile(presign.data, files)
              .pipe(takeUntil(this._unsubscribe$))
              .subscribe({
                next: async () => {
                  // var CryptoJS = require('crypto-js');
                  var reader = new FileReader();
                  var that = this;
                  reader.onload = function (event) {
                    var data = event.target.result;
                    var encrypted = sha256(data);

                    that.multimediaList.push({
                      fileName: fileName,
                      key: presign.key,
                      hash: encrypted.toString(),
                    });
                  };
                  reader.readAsBinaryString(file);
                  this.globalService.stopLoading();
                },
                error: async (err: any) => {
                  this.globalService.stopLoading();
                  console.error(err);
                },
              });
          },
          error: async (err: any) => {
            this.globalService.stopLoading();
            console.error(err);
          },
        });
    }
  }

  templateSelected($event) {
    this.document.body = $event.value.body;
  }

  async download(key: string) {
    await this.globalService.presentLoading('Descargando...');
    this.multimediaService
      .getDownloadSignedUrl(key)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: async (resp: any) => {
          window.open(resp.url, '_blank');
          await this.globalService.stopLoading();
        },
        error: async () => await this.globalService.stopLoading(),
      });
  }

  private async initResponse() {
    this.isTypeReply = true;
    await this.globalService.presentLoading('Por favor espere...');
    this.wait = true;
    this.documentService
      .getDocumentsByUUID(this.activatedRoute.snapshot.params['respuuid'])
      .subscribe({
        next: async (resp: any) => {
          // recorre los usuario para llenar el sender y destinations
          this.document.id = resp.data.id;
          this.document.destinationSelected = [];
          for (let i = 0; i < resp.data.documentUsers.length; i++) {
            let du = resp.data.documentUsers[i];
            if (du.documentUserType.id == 3) {
              // verifica si el remitente es el usuario logueado patea
              if (this.userService.getUser().id == du.user.id) {
                await this.globalService.showToast(
                  'No puede responder un documento enviado por usted mismo.',
                  'danger'
                );
                this.router.navigate(['/']);
              }

              // el que envio ahora es el destinatario.
              this.document.destinationSelected.push(du.user);
            }
          }
          this.wait = false;
          await this.globalService.stopLoading();
        },
        error: async () => {
          this.wait = false;
          await this.globalService.stopLoading();
        },
      });
    const idx = this.allDocumentTypes.findIndex((docType: any) => {
      return docType.alias === 'response';
    });
    this.document.documentType = idx !== -1 ? this.allDocumentTypes[idx] : null;
    const typeId = !!this.document.documentType
      ? this.document.documentType.id
      : -1;
    // enganchar al API de transactions types utilizados en documentos
    this.listTransactionsTypes(typeId);
  }

  listTransactionsTypes(typeId) {
    // enganchar al API de transactions types utilizados en documentos
    this.transactionsTypeService
      .getDocumentsByDocumentstype(typeId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respDT: any) => {
        // los recorre si son required lo pone en true
        for (let i = 0; i < respDT.data.length; i++) {
          respDT.data[i].checked = false;
          if (respDT.data[i].required) {
            respDT.data[i].checked = true;
          }
        }

        this.transactionstypes = respDT.data;
        // se asigna el total
        this.totalCoins();
      });
  }

  private async sendResponseDocument() {
    if (this.canCreateDocument() && !this.wait) {
      await this.globalService.presentLoading('Por favor espere...');
      this.wait = true;
      const data: any = {
        id: this.document.id,
        senderType: this.document.senderType,
        subject: this.document.subject,
        body: this.document.body,
        senderUserIds: [this.document.senderSelected.id],
        destinationUserIds: this.getDestinationToSent(),
        documentTypeId: this.document.documentType.id,
        documentStatusId: 2,
        transactionstypes: this.transactionstypes,
        total: this.document.total,
        multimedias: this.multimediaList,
      };
      this.documentService
        .responseDocument(data)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: async () => {
            await this.globalService.stopLoading();
            this.wait = false;
            await this.globalService.showToast(
              'El documento se ha enviado con exito',
              'success'
            );
            this.router.navigate(['/']);
          },
          error: async (data) => {
            await this.globalService.stopLoading();
            await this.globalService.showToast(
              `Hubo un error al responder el documento. Mensaje: ${
                data.error.message || ''
              }`,
              'danger'
            );
            this.wait = false;
          },
        });
    }
  }
}
