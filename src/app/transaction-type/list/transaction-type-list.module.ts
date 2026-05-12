import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';
import { TransactionTypeListPageRoutingModule } from './transaction-type-list-routing.module';
import { TransactionTypeListPage } from './transaction-type-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    TransactionTypeListPageRoutingModule,
  ],
  declarations: [TransactionTypeListPage],
})
export class TransactionTypeListPageModule {}
