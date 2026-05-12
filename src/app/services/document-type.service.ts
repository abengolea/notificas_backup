import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  public token: string;
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/documents-types';
  }

  getAllDocumentTypes() {
    let qb = RequestQueryBuilder.create();
    qb.setPage(1).setLimit(2000);
    return this.http.get<any>(`${this.urlAPI}?${qb.query()}`);
  }
}
