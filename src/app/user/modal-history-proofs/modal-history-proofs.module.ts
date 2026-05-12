import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalHistoryProofsPageRoutingModule } from './modal-history-proofs-routing.module';

import { ModalHistoryProofsPage } from './modal-history-proofs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalHistoryProofsPageRoutingModule
  ],
  declarations: [ModalHistoryProofsPage]
})
export class ModalHistoryProofsPageModule {}
