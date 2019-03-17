import { Component } from '@angular/core';

import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { ToastService } from './services/toast/toast.service';
import { Network } from '@ionic-native/network/ngx';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { UserService } from './services/user/user.service';

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
    private headerColor: HeaderColor,
    private navCtrl: NavController,
    private userService: UserService
  ) {
    this.initializeApp();
    this.userService
      .getCurrentUser()
      .then(user => {
        if (!user) {
          alert('access denied!');
          this.navCtrl.navigateRoot(['login']);
          return false;
        } else {
          return true;
        }
      })
      .catch(error => {
        alert(error);
        this.navCtrl.navigateRoot(['login']);
        return false;
      });

    this.headerColor.tint('#1c1c1c');
    this.checkNetworkConnection();
  }

  async checkNetworkConnection() {
    //KEEPS CHECKING NETWORK CONNECTIVITY AND ALERTS USER IF DISCONNECTED
    this.network.onDisconnect().subscribe(async () => {
      const alert = await this.alertCtrl.create({
        header: 'Connection Failed!',
        subHeader: 'There may be a problem in your internet connection. Please try again !',
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
