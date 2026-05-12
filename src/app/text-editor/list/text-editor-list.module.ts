import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { CKEditorModule } from 'ng2-ckeditor';

import { TextEditorListPageRoutingModule } from './text-editor-list-routing.module';
import { TextEditorListPage } from './text-editor-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    QuillModule.forRoot({
      modules: {
        syntax: true,
      },
    }),
    TextEditorListPageRoutingModule,
    IonicSelectableModule,
    CKEditorModule,
  ],
  declarations: [TextEditorListPage],
})
export class TextEditorListPageModule {}
