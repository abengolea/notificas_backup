import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  public token: string;
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/multimedia';
  }

  getUploadSignedUrl(fileName: string | null) {
    let param = '?';
    if (!!fileName) {
      param += `fileName=${fileName}`;
    }
    return this.http.get<any>(`${this.urlAPI}/upload-sign-url${param}`);
  }

  getDownloadSignedUrl(key: string) {
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.get<any>(`${this.urlAPI}/download-sign-url/${key}`, {
      headers: { 'Content-Type': 'application/json' },
      params: httpParams,
    });
  }

  uploadFile(data: any, fileList: FileList) {
    const formData = new FormData();
    Object.keys(data.fields).forEach((key) => {
      formData.append(key, data.fields[key]);
    });
    const file = Array.from(fileList)[0];
    formData.append('file', file, file.name);
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.post<any>(data.url, formData, {
      params: httpParams,
    });
  }

  deleteMultimedia(id: string, key: string) {
    return this.http.delete<any>(`${this.urlAPI}/${id}/${key}`, {});
  }
}
