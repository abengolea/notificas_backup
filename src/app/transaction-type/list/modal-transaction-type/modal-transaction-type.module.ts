import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalTransactionTypePageRoutingModule } from './modal-transaction-type-routing.module';

import { ModalTransactionTypePage } from './modal-transaction-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalTransactionTypePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ModalTransactionTypePage]
})
export class ModalTransactionTypePageModule {}
