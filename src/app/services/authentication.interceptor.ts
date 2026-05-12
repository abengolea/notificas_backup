import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { GlobalService } from './global.service';
import { AlertController } from '@ionic/angular';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private globalService: GlobalService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let ifTokenOk = true;
    // Get the auth header from your auth service.
    const authToken = this.userService.getToken();
    if (!req.params.get('skiptokevalidator')) {
      if (this.tokenExpired(authToken)) {
        // this.globalService.presentarAlerta('Sesión caducada', 'Por favor, vuelva a iniciar sesión');
        ifTokenOk = false;
      }
    }

    if (!ifTokenOk) {
      this.globalService.presentarAlerta(
        'Sesión caducada',
        'Por favor, vuelva a iniciar sesión'
      );
      this.userService.logout();
    } else {
      // AGREGAMOS EL TOKEN EN TODAS LAS CONSULTAS AL SERVIDOR
      let authReq: any;
      if (req.params.get('skiptokevalidator')) {
        authReq = req.clone({
          params: req.params.delete('skiptokevalidator'),
        });
      } else {
        authReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + authToken),
          params: req.params.delete('skiptokevalidator'),
        });
      }

      return next.handle(authReq).pipe(
        // We use the map operator to change the data from the response
        map((resp) => {
          // Several HTTP events go through that Observable
          // so we make sure that this is a HTTP response
          if (resp instanceof HttpResponse) {
            // Just like for request, we create a clone of the response
            // and make changes to it, then return that clone
            if (resp.body && resp.body.token) {
              if (this.userService.getUser()) {
                this.userService.setToken(resp.body.token);
              }
            }
            return resp;
          }
        })
      );
    }
  }

  private tokenExpired(token: string) {
    if (token == '' || token == null) {
      this.userService.logout();
      return false;
    } else {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    }
  }
}
