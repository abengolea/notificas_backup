import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { MultimediaService } from '../services/multimedia.service';

@Component({
  selector: 'app-download-file',
  templateUrl: './download-file.page.html',
  styleUrls: ['./download-file.page.scss'],
})
export class DownloadFilePage implements OnInit {
  constructor(
    private menu: MenuController,
    private globalService: GlobalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private multimediaService: MultimediaService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.menu.enable(false);

    if (this.activatedRoute.snapshot.params['key']) {
      const loadingSplash = this.loadingCtrl.create({
        message: 'Descargando...',
      });
      await (await loadingSplash).present();
      this.multimediaService
        .getDownloadSignedUrl(this.activatedRoute.snapshot.params['key'])
        .subscribe(
          async (resp: any) => {
            (await loadingSplash).dismiss();
            window.location.href = resp.url;
            setTimeout(() => {
              window.close();
            }, 5000);
          },
          async () => (await loadingSplash).dismiss()
        );
    } else {
      this.globalService.showToast('Página no encontrada', 'warning');
      this.router.navigate(['/']);
    }
  }
}
