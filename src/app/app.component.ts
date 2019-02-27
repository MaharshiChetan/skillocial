import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private nativeStorage: NativeStorage,
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this.initializeApp();
    this.checkStorage();
  }

  async checkStorage() {
    if (this.platform.is('cordova')) {
      const user = await this.nativeStorage.getItem('user');
      if (user) {
        this.navCtrl.navigateRoot(['tabs']);
      } else {
        this.navCtrl.navigateRoot(['login']);
      }
    } else {
      const user = await this.storage.get('user');
      if (user) {
        this.navCtrl.navigateRoot(['tabs']);
      } else {
        this.navCtrl.navigateRoot(['login']);
      }
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
