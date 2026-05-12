import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '../../services/global.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  users: any[] = [];
  textSearch: string | null;
  wait: boolean;

  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService
  ) {}

  ngOnInit() {}

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

  newContact() {
    this.router.navigate(['/contacts/new']);
  }

  editContact(user: any) {
    if (user.useruser_id) {
      this.router.navigate([`/contacts/edit/${user.useruser_id}`]);
    } else {
      this.globalService.showToast(
        `Es un contacto público, no puede editar sus datos.`,
        'warning'
      );
    }
  }

  deleteContact(id: string) {
    if (!this.wait) {
      this.wait = true;
      this.userService.deleteUserByUserId(id).subscribe(
        () => {
          this.initData(null);
          this.globalService.showToast(
            `El contacto se elimino con éxito.`,
            'success'
          );
          this.wait = false;
        },
        (err: any) => {
          console.error(err);
          this.globalService.showToast(
            `Hubo un error al eliminar el contacto`,
            'error'
          );
          this.wait = false;
        }
      );
    }
  }

  private initData(text: string | null) {
    this.wait = true;
    this.userService.searchUsers(text, false).subscribe(
      (resp: any) => {
        this.users = resp.data;
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.wait = false;
      }
    );

    // this.userService.getUsersByUser(text).subscribe(
    //   (resp: any) => {
    //     this.users = resp;
    //     this.wait = false;
    //     this.changeDetectorRef.detectChanges();
    //   },
    //   () => {
    //     this.wait = false;
    //   }
    // );
  }
}
