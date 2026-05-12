import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentAccountPage } from './current-account.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentAccountPageRoutingModule {}
