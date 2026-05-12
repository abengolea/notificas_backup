import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { CKEditorModule } from 'ng2-ckeditor';
import { DocumentArchiveListPageRoutingModule } from './document-archive-list-routing.module';
import { DocumentArchiveListPage } from './document-archive-list.page';

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
    DocumentArchiveListPageRoutingModule,
    IonicSelectableModule,
    CKEditorModule,
  ],
  declarations: [DocumentArchiveListPage],
})
export class DocumentArchiveListPageModule {}
