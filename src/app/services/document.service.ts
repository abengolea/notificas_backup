import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/documents';
  }

  responseDocument(data: {
    id?: number;
    senderType: string;
    subject: string;
    body: string;
    destinationUserIds: any[];
    senderUserIds: any[];
    documentTypeId: string | number;
    multimedias: any[];
  }) {
    return this.http.post<any>(`${this.urlAPI}/response`, {
      ...data,
    });
  }

  duplicateDocument(id: number) {
    return this.http.post<any>(`${this.urlAPI}/${id}/duplicate`, {});
  }

  deleteDocument(id: number) {
    return this.http.delete<any>(`${this.urlAPI}/${id}`);
  }

  archiveDocument(id: number) {
    return this.http.post<any>(`${this.urlAPI}/${id}/archive`, {});
  }

  desarchiveDocument(id: number) {
    return this.http.post<any>(`${this.urlAPI}/${id}/unarchive`, {});
  }

  saveDocument(data: {
    id?: number;
    senderType: string;
    subject: string;
    body: string;
    destinationUserIds: any[];
    senderUserIds: any[];
    documentTypeId: string | number;
    multimedias: any[];
  }) {
    if (data.id) {
      let url = this.urlAPI + '/' + data.id;
      return this.http.put<any>(`${url}?`, {
        ...data,
      });
    } else {
      return this.http.post<any>(`${this.urlAPI}?`, {
        ...data,
      });
    }
  }

  saveDocumentSponsoring(
    data: {
      id?: number;
      senderType: string;
      subject: string;
      body: string;
      destinationUserIds: any[];
      senderUserIds: any[];
      documentTypeId: string | number;
      multimedias: any[];
    },
    userSponser
  ) {
    // console.log('En Servicio', userSponser);
    return this.http.post<any>(`${this.urlAPI}/userSponser`, {
      data: { ...data },
      userSponser: { userSponser },
    });
  }

  getDocumentsDraft(text: string | null) {
    let paramFilter = `page=1&limit=50`;
    if (!!text) {
      paramFilter += `&body=${text}`;
    }
    return this.http.get<any>(`${this.urlAPI}/drafts?${paramFilter}`);
  }

  getDocumentsSended(text: string | null) {
    let paramFilter = `page=1&limit=250&folderIdNull=true`;
    if (!!text) {
      paramFilter += `&body=${text}`;
    }
    return this.http.get<any>(`${this.urlAPI}?${paramFilter}`);
  }

  getDocumentsArchive(text: string | null) {
    let paramFilter = `page=1&limit=50&folderIsNotNull=true`;
    if (!!text) {
      paramFilter += `&body=${text}`;
    }
    return this.http.get<any>(`${this.urlAPI}?${paramFilter}`);
  }

  getDocumentsByUUID(uuid: string) {
    if (!!uuid) {
      return this.http.get<any>(this.urlAPI + '/uuid_token/' + uuid, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return null;
  }

  getDocumentsByUUIDReader(uuid: string) {
    if (!!uuid) {
      let httpParams = new HttpParams().set('skiptokevalidator', 'true');
      return this.http.get<any>(this.urlAPI + '/uuid/' + uuid, {
        headers: { 'Content-Type': 'application/json' },
        params: httpParams,
      });
    }
    return null;
  }

  getPDF(uuid: string) {
    if (!!uuid) {
      return this.http.get<any>(this.urlAPI + '/get-pdf/' + uuid, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return null;
  }

  getHistoryByUUID(uuid: string) {
    if (!!uuid) {
      let httpParams = new HttpParams().set('skiptokevalidator', 'true');
      return this.http.get<any>(this.urlAPI + '/history/' + uuid, {
        headers: { 'Content-Type': 'application/json' },
        params: httpParams,
      });
    }
    return null;
  }

  uploadMultimedia(fileList: FileList) {
    const formData: FormData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append(
        'file',
        file,
        `${Math.round(Math.random() * 90000)}_${file.name}`
      );
    });
    return this.http.post<any>(`${this.urlAPI}/upload-multimedias?`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }

  getDocumentMultimedia(documentId: string) {
    return this.http.get<any>(`${this.urlAPI}/${documentId}/multimedias?`);
  }

  createTicketFile(documentId: string, files: any[]) {
    return this.http.post<any>(`${this.urlAPI}/${documentId}/multimedias?`, {
      files: [...files],
    });
  }
}
