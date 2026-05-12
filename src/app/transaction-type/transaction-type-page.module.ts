import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { TransactionTypePageRoutingModule } from './transaction-type-routing.module';
import { TransactionTypePage } from './transaction-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    TransactionTypePageRoutingModule,
  ],
  declarations: [TransactionTypePage],
})
export class TransactionTypePageModule {}
