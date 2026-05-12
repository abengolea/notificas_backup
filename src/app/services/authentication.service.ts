import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector, Inject, forwardRef } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthenticationService {
  constructor(@Inject(forwardRef(() => Injector)) private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const auth = this.injector.get(UserService);
    const authToken = auth.getToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Token ' + authToken),
    });
    return next.handle(authReq);
  }
}
