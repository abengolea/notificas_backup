import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ToastController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

export type ordenamiento = {
  nombre: string;
  orden: string;
};

export type filtro = {
  nombre: string;
  operacion: string;
  dato: string;
};

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  BASE_PROXY_URL = '/qapp';

  public url_api: string = '';
  public url_multimedias: string = '';

  constructor(
    public http: HttpClient,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private datePipe: DatePipe
  ) {
    this.url_api = environment.apiUrl;

    if (
      location.host === 'localhost:8100' ||
      location.host == 'localhost:8200' ||
      location.host == 'localhost:4200'
    ) {
      this.url_api = 'http://localhost:3000';
    } else if (location.href.indexOf('/test') > -1) {
      // URL A API DE TEST RELATIVA Ej: '/test/api2'
      this.url_api = '';
    }
  }

  setUrlApi(pUrl) {
    this.url_api = pUrl;
    localStorage.setItem('url_api', this.url_api);
  }

  getUrlApi() {
    return this.url_api;
  }

  crearParametroFiltro(filtros: filtro[] = []) {
    let parametroFiltro: string = '';
    if (filtros.length) {
      filtros.forEach((filtro) => {
        parametroFiltro = `${parametroFiltro}&filter=${filtro.nombre}||${filtro.operacion}||${filtro.dato}`;
      });
    }
    return parametroFiltro;
  }

  crearParametroOrden(ordenar: ordenamiento[] = []): string {
    let respuesta: string = '';
    if (ordenar.length) {
      ordenar.forEach((ordenData) => {
        respuesta = `&sort=`;
        respuesta += `${ordenData.nombre},${ordenData.orden.toUpperCase()}`;
      });
    }
    return respuesta;
  }

  async showToast(pText, pColor?) {
    if (!pColor) {
      pColor = 'dark';
    }
    const toast = await this.toastController.create({
      message: pText,
      color: pColor,
      duration: 3000,
    });
    toast.present();
  }

  loading: any;
  async presentLoading(pText?) {
    if (!pText) {
      pText = 'Por favor espere...';
    }
    this.loading = await this.loadingController.create({
      message: pText,
      duration: 5000,
    });
    await this.loading.present();
  }

  async stopLoading() {
    if(this.loading) {
      await this.loading.dismiss();
    }    
  }

  fechaFormato(date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  async presentarAlerta(titulo?, mensaje?) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  getDiaStringFromOrden(pOrden) {
    switch (pOrden) {
      case 0:
        return 'Feriados';
      case 1:
        return 'Domingo';
      case 2:
        return 'Lunes';
      case 3:
        return 'Martes';
      case 4:
        return 'Miércoles';
      case 5:
        return 'Jueves';
      case 6:
        return 'Viernes';
      case 7:
        return 'Sábado';
    }
  }
}
