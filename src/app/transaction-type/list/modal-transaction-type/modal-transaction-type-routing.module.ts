import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalTransactionTypePage } from './modal-transaction-type.page';

const routes: Routes = [
  {
    path: '',
    component: ModalTransactionTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalTransactionTypePageRoutingModule {}
