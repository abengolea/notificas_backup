import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { UserListPage } from './user-list.page';
import { UserListPageRoutingModule } from './user-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    UserListPageRoutingModule,
  ],
  declarations: [UserListPage],
})
export class UserListPageModule {}
