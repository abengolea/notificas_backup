import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentTemplatePage } from './document-template.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentTemplatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentTemplatePageRoutingModule {}
