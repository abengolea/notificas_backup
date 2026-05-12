import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  public token: string;
  private urlAPI: string;

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/admin/users';
  }

  getUsers(
    page: number = 1,
    limit: number = 500,
    textSearch: string | null = null
  ) {
    let params = `page=${page}&limit=${limit}`;
    if (!!textSearch) {
      params = `${params}&text=${textSearch.trim()}`;
    }
    return this.http.get<any>(`${this.urlAPI}?${params}`);
  }

  createUser(data: any) {
    return this.http.post<any>(`${this.urlAPI}`, { ...data });
  }

  saveIsBlocked(data: any) {
    return this.http.post<any>(`${this.urlAPI}/to-blocked-unblocked`, {
      ...data,
    });
  }
}
