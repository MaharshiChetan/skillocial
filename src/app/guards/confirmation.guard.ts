import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
// import { Observable } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationGuard implements ConfirmationGuard {
  showAlertMessage: boolean = true;

  constructor(private alertCtrl: AlertController, private navCtrl: NavController) {}
  async canDeactivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.showAlertMessage) {
      let alertPopup = await this.alertCtrl.create({
        header: 'Discard Event?',
        message: "The changes for event made won't be get saved.",
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Discard Event',
            handler: async () => {
              await alertPopup.dismiss();
              this.exitPage();
              return false;
            },
          },
        ],
      });
      await alertPopup.present();
      return false;
    }
    return true;
  }

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.navigateBack(['/tabs/upcoming-events']);
  }
}
