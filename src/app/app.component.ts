import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { MaintenanceAlertService } from './services/maintenance-alert.service';
import { ProofService } from './services/proof.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/folder/Inbox', icon: 'las la-home iq-arrow-left' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];

  currentUser: any;

  banAdmin = false;

  useEmail:string="";

  constructor(
    public proofService: ProofService,
    private router: Router,
    public userService: UserService,
    private maintenanceAlert: MaintenanceAlertService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let rutaActual = (<NavigationEnd>event).url;
        let aux = rutaActual.split('/');
        if (
          ['login', 'recover', 'reader', 'history', 'download-file'].indexOf(aux[1]) != -1
        ) {
          this.banAdmin = false;
        } else {
          proofService.refreshBalanceCoins();
          this.currentUser = this.userService.getUser();
          this.useEmail=this.currentUser.email;
          if (
            this.currentUser &&
            this.currentUser.userGroup &&
            this.currentUser.userGroup.id == 1
          ) {
            this.banAdmin = true;
          } else {
            this.banAdmin = false;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.currentUser = this.userService.getUser();
    if (this.maintenanceAlert.isMaintenanceBlocked) {
      this.maintenanceAlert.present();
    }
  }

  newNotification() {
    this.router.navigate(['/text-editor']);
  }

  logout() {
    this.userService.logout();
  }
}
