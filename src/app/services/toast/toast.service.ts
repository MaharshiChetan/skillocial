import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async showToast(message: string, position?: 'top') {
    const toast = await this.toastCtrl.create({
      showCloseButton: position !== 'top' ? true : false,
      message: message || 'Something went wrong!',
      duration: 2000,
      position: position || 'bottom',
    });

    return toast.present();
  }
}
