import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { DocumentTemplatePageRoutingModule } from './document-template-routing.module';
import { DocumentTemplatePage } from './document-template.page';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    DocumentTemplatePageRoutingModule,
    CKEditorModule,
  ],
  declarations: [DocumentTemplatePage],
})
export class DocumentTemplateModule {}
