import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
  },
  {
    path: 'modal-history-proofs',
    loadChildren: () => import('./modal-history-proofs/modal-history-proofs.module').then( m => m.ModalHistoryProofsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
