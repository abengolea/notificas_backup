import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Subject } from 'rxjs';

import { GlobalService } from './global.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionTypeService {
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/transactions-types';
  }

  getDocumentsByDocumentstype(dt: number) {
    if (!!dt) {
      const param = `documentTypeId=${dt}`;
      return this.http.get<any>(`${this.urlAPI}?${param}`);
    }
    return null;
  }

  getTransactionTypes(text: string | null) {
    let param = '';
    if (!!text && text.trim() !== '') {
      param = `text=${text}`;
    }
    return this.http.get<any>(`${this.urlAPI}?${param}`);
  }

  getTransactionTypesForSale() {
    return this.http.get<any>(`${this.urlAPI}/filter/forsale`);
  }

  getTransactionTypeById(id: string) {
    return this.http.get<any>(`${this.urlAPI}/${id}`);
  }

  updateTransactionTypes(id: string, data: any) {
    return this.http.put<any>(`${this.urlAPI}/${id}`, {
      ...data,
    });
  }

  saveTransactionTypes( data: any) {
    return this.http.post<any>(`${this.urlAPI}`, {
      ...data,
    });
  }

  toggleActive(id: string, data: any) {
    return this.http.put<any>(`${this.urlAPI}/${id}/toggle-active`, {
      ...data,
    });
  }
}
