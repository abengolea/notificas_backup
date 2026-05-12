import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ProofService {
  private urlAPI: string;

  private balanceSource = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSource.asObservable();

  constructor(public http: HttpClient, private globalService: GlobalService) {
    this.urlAPI = this.globalService.getUrlApi() + '/proofs';
  }

  refreshBalanceCoins() {
    this.getBalance().subscribe(
      (resp: any) => {
        this.balanceSource.next(resp.total);
      },
      () => {
        this.balanceSource.next(0);
      }
    );
  }

  getBalance() {
    return this.http.get<any>(`${this.urlAPI}/balance`);
  }

  getCurrentAccount() {
    return this.http.get<any>(`${this.urlAPI}/current-account`);
  }

  getCurrentAccountByID(id: number) {

    console.log('aver')
    return this.http.get<any>(`${this.urlAPI}/currentaccountbyid/${id}`);
  }

  addBonus(data: any) {
    return this.http.post<any>(`${this.urlAPI}/add-bonus`, {
      ...data,
    });
  }

  getBonus(data: any) {
    return this.http.post<any>(`${this.urlAPI}/get-bonus`, {
      ...data,
    });
  }

  checkout(data: any) {
    return this.http.post<any>(`${this.urlAPI}/mp-checkout`, {
      ...data,
    });
  }

  addCoinsByAdmin(data: any) {
    return this.http.post<any>(`${this.urlAPI}/addCoinsByAdmin`, {
      ...data,
    });
  }
}
