import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TextEditorPage } from './text-editor.page';

const routes: Routes = [
  {
    path: '',
    component: TextEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextEditorPageRoutingModule {}
