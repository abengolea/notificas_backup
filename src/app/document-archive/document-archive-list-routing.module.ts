import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentArchiveListPage } from './document-archive-list.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentArchiveListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentArchiveListPageRoutingModule {}
