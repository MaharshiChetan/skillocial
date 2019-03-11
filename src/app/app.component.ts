import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { ToastService } from './services/toast/toast.service';
import { Network } from '@ionic-native/network/ngx';
import { HeaderColor } from '@ionic-native/header-color/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private network: Network,
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private headerColor: HeaderColor
  ) {
    this.initializeApp();
    this.headerColor.tint('#1c1c1c');
    this.checkNetworkConnection();
  }

  async checkNetworkConnection() {
    //KEEPS CHECKING NETWORK CONNECTIVITY AND ALERTS USER IF DISCONNECTED
    this.network.onchange().subscribe(async networkChange => {
      if (networkChange.type === 'online') {
        this.toastService.showToast('Back Online');
      } else if (networkChange.type === 'offline') {
        const alert = await this.alertCtrl.create({
          header: 'Connection Failed!',
          subHeader: 'There may be a problem in your internet connection. Please try again !',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
