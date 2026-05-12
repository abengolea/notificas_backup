import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadFilePageRoutingModule } from './download-file-routing.module';

import { DownloadFilePage } from './download-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadFilePageRoutingModule
  ],
  declarations: [DownloadFilePage]
})
export class DownloadFilePageModule {}
