import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadFilePage } from './download-file.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadFilePageRoutingModule {}
