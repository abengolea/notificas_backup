import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { Router } from '@angular/router';
import { RequestQueryBuilder, CondOperator } from '@nestjsx/crud-request';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public token: string;
  private userLogged = new BehaviorSubject<any>({});
  private urlAPI: string;

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    public http: HttpClient,
    @Inject('AUTH_STORE') private authStore: string,
    private router: Router,
    private globalService: GlobalService
  ) {
    this.urlAPI = this.globalService.getUrlApi() + '/users';
  }

  signIn(data: any): Observable<any> {
    console.log(this.urlAPI);
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.post<any>(
      `${this.urlAPI}`,
      { ...data },
      { headers: { 'Content-Type': 'application/json' }, params: httpParams }
    );
  }

  createUser(data: any) {
    return this.http.post<any>(`${this.urlAPI}/crear`, { ...data });
  }

  getUser() {
    let auth: any = JSON.parse(localStorage.getItem(this.authStore));
    return auth && auth.user;
  }

  getUserByToken() {
    return this.http.get<any>(`${this.urlAPI}/getbytoken`);
  }

  getUserLogged() {
    return this.userLogged.asObservable();
  }

  isAdmin() {
    let user = this.getUserLogged();
    //console.log(user);
    return true;
  }

  searchUsers(text: string, withAttachments?) {
    let param = `1=1`;
    if (text) {
      param += `&query=${text}`;
    }
    if (withAttachments) {
      param += `&attachments=${withAttachments}`;
    }
    return this.http.get<any>(`${this.urlAPI}?${param}`);
  }

  login(pParametros): Observable<any> {
    var params = {
      email: pParametros.email,
      password: Md5.hashStr(pParametros.password.trim()),
    };
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.post<any>(this.urlAPI + '/login', params, {
      headers: { 'Content-Type': 'application/json' },
      params: httpParams,
    });
  }

  recoverPassword(pParametros): Observable<any> {
    var params = {
      email: pParametros.email,
    };
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.post<any>(this.urlAPI + '/recover', params, {
      headers: { 'Content-Type': 'application/json' },
      params: httpParams,
    });
  }

  changePassword(pParametros): Observable<any> {
    var params = {
      password: pParametros.password,
      recoverpassword: pParametros.recoverpassword,
    };
    let httpParams = new HttpParams().set('skiptokevalidator', 'true');
    return this.http.post<any>(this.urlAPI + '/change_password', params, {
      headers: { 'Content-Type': 'application/json' },
      params: httpParams,
    });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.clear();
    this.userLogged.next({});
    this.router.navigate(['/login']);
  }

  getToken() {
    let auth: any = JSON.parse(localStorage.getItem(this.authStore));
    return auth && auth.token;
  }

  setToken(pToken) {
    let auth: any = JSON.parse(localStorage.getItem(this.authStore));
    let user = auth && auth.user;
    localStorage.setItem(
      this.authStore,
      JSON.stringify({ user: user, token: pToken })
    );
  }

  setUserLogged(u) {
    this.userLogged.next(u);
  }

  saveUserLogged(pUser, pToken?) {
    if (!pToken) {
      var auth: any = JSON.parse(localStorage.getItem(this.authStore));
      pToken = auth && auth.token;
    }
    localStorage.setItem(
      this.authStore,
      JSON.stringify({ user: pUser, token: pToken })
    );
    this.setUserLogged(pUser);
    // console.log('Show: PUser')
    // console.log(pUser)
  }

  saveProfile(pParametros): Observable<any> {
    return this.http.post<any>(this.urlAPI + '/profile', pParametros, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  emailValidate(pParametros): Observable<any> {
    return this.http.post<any>(this.urlAPI + '/email_validate', pParametros, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getUsersByUser(text: string) {
    const param = !!text ? `text=${text}` : null;
    return this.http.get<any>(`${this.urlAPI}/contacts?${param}`);
  }

  getUsersByUserId(id: string) {
    return this.http.get<any>(`${this.urlAPI}/contacts/${id}`);
  }

  deleteUserByUserId(id: string) {
    return this.http.delete<any>(`${this.urlAPI}/contacts/${id}`);
  }

  saveUsersByUsers(id: string | null | undefined, data: any) {
    if (!!id) {
      return this.http.put<any>(`${this.urlAPI}/contacts/${id}`, { ...data });
    } else {
      return this.createUser(data);
    }
  }

  getUserType(id: string) {
    return this.http.get<any>(`${this.urlAPI}/userType/${id}`);
  }
}
