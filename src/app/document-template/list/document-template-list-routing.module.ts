import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentTemplateListPage } from './document-template-list.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentTemplateListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentTemplateListRoutingModule {}
