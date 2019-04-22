import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading: HTMLIonLoadingElement;
  constructor(private loadingCtrl: LoadingController) {}

  async show(message?: any) {
    this.loading = await this.loadingCtrl.create({
      message: message || 'Please wait...',
      backdropDismiss: true
    });
    return this.loading.present();
  }

  async hide() {
    return this.loading.dismiss();
  }
}
