import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';

import { ContactPageRoutingModule } from './contact-routing.module';
import { ContactPage } from './contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    ContactPageRoutingModule,
  ],
  declarations: [ContactPage],
})
export class ContactPageModule {}
