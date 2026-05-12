import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionTypeListPage } from './transaction-type-list.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionTypeListPage,
  },
  {
    path: 'modal-transaction-type',
    loadChildren: () => import('./modal-transaction-type/modal-transaction-type.module').then( m => m.ModalTransactionTypePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionTypeListPageRoutingModule {}
