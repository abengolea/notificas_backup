import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { DocumentTemplateListRoutingModule } from './document-template-list-routing.module';
import { DocumentTemplateListPage } from './document-template-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    DocumentTemplateListRoutingModule,
  ],
  declarations: [DocumentTemplateListPage],
})
export class DocumenTemplateListPageModule {}
