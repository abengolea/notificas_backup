import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentTemplateService {
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/documents-templates';
  }

  getDocumentTemplates(text: string | null) {
    let param = '';
    if (!!text && text.trim() !== '') {
      param = `text=${text}`;
    }
    return this.http.get<any>(`${this.urlAPI}?${param}`);
  }

  getDocumentTemplateById(id: string) {
    return this.http.get<any>(`${this.urlAPI}/${id}`);
  }

  save(name: string, body: string, documentTypeId: string) {
    return this.http.post<any>(`${this.urlAPI}`, {
      name: name,
      body: body,
      documentTypeId: documentTypeId,
    });
  }

  update(id: number, name: string, body: string, documentTypeId: string) {
    return this.http.put<any>(`${this.urlAPI}/${id}`, {
      name: name,
      body: body,
      documentTypeId: documentTypeId,
    });
  }

  deleteDocumentTemplate(id: string) {
    return this.http.delete<any>(`${this.urlAPI}/${id}`);
  }
}
