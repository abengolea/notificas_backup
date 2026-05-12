import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { DocumentService } from '../services/document.service';
import { GlobalService } from '../services/global.service';
@Component({
  selector: 'app-document-archive-list',
  templateUrl: './document-archive-list.page.html',
  styleUrls: ['./document-archive-list.page.scss'],
})
export class DocumentArchiveListPage implements OnInit {
  documents: any[] = [];
  textSearch: string | null;
  wait: boolean;

  constructor(
    private documentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private globalService: GlobalService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.initData(null);
  }

  search() {
    if (!!this.textSearch && this.textSearch.trim() !== '') {
      this.initData(this.textSearch);
    } else {
      this.initData(null);
    }
  }

  private initData(text: string | null) {
    this.wait = true;
    this.documentService.getDocumentsArchive(text).subscribe(
      (resp: any) => {
        this.documents = resp.data;
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      },
      () => {
        this.wait = false;
        this.changeDetectorRef.detectChanges();
      }
    );
  }

  goToReader(uuid: string) {
    this.router.navigate([`/reader/${uuid}`, {}]);
  }

  desarchiveDoc(doc) {
    this.documentService.desarchiveDocument(doc.id).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (err) => console.error(err)
    );
  }
}
