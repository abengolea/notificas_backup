import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';
import { ContactListPage } from './contact-list.page';
import { ContactListPageRoutingModule } from './contact-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    ContactListPageRoutingModule,
  ],
  declarations: [ContactListPage],
})
export class ContactListPageModule {}
