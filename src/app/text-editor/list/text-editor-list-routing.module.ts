import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TextEditorListPage } from './text-editor-list.page';

const routes: Routes = [
  {
    path: '',
    component: TextEditorListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextEditorListPageRoutingModule {}
