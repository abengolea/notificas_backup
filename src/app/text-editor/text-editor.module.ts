import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { CKEditorModule } from 'ng2-ckeditor';

import { TextEditorPageRoutingModule } from './text-editor-routing.module';
import { TextEditorPage } from './text-editor.page';

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
    TextEditorPageRoutingModule,
    IonicSelectableModule,
    CKEditorModule,
  ],
  declarations: [TextEditorPage],
})
export class TextEditorPageModule {}
