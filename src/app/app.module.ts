import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import localeEsAr from '@angular/common/locales/es-AR';

import { DatePipe } from '@angular/common';

registerLocaleData(localeEsAr);

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationInterceptor } from './services/authentication.interceptor';
import { registerLocaleData } from '@angular/common';
import { NotificationsComponent } from './popovers/notifications/notifications.component';

@NgModule({
    declarations: [AppComponent, NotificationsComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot({ mode: 'md' }),
        AppRoutingModule,
        IonicSelectableModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: LOCALE_ID, useValue: 'es-Ar' },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: 'AUTH_STORE', useValue: 'notificas.auth' },
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
