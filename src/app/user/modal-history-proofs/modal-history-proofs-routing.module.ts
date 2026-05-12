import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalHistoryProofsPage } from './modal-history-proofs.page';

const routes: Routes = [
  {
    path: '',
    component: ModalHistoryProofsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalHistoryProofsPageRoutingModule {}
