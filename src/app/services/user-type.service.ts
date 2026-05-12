import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {
  public token: string;
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/users-types';
  }

  getAllUserTypes() {
    let qb = RequestQueryBuilder.create();
    qb.setPage(1).setLimit(1000);
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.get<any>(`${this.urlAPI}?${qb.query()}`,{
      params: httpParams});
  }
}
