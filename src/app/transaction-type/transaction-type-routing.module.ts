import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionTypePage } from './transaction-type.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionTypePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionTypePageRoutingModule {}
