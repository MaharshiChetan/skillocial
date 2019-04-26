import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Network } from '@ionic-native/network/ngx';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/tabs/home',
      icon: 'home',
      class: ''
    },
    {
      title: 'My Events',
      url: '/my-events',
      icon: 'calendar',
      class: 'far fa-calendar-alt'
    },
    {
      title: 'Notification',
      url: '/tabs/notifications',
      icon: 'notifications-outline',
      class: 'far fa-bell'
    },
    {
      title: 'Profile',
      url: '/tabs/profile',
      icon: 'contact',
      class: 'far fa-user'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private network: Network,
    private alertCtrl: AlertController,
    private headerColor: HeaderColor
  ) {
    this.initializeApp();
    firebase.initializeApp(environment.firebase);
    this.headerColor.tint('#1c1c1c');
    this.checkNetworkConnection();
  }

  async checkNetworkConnection() {
    //KEEPS CHECKING NETWORK CONNECTIVITY AND ALERTS USER IF DISCONNECTED
    this.network.onDisconnect().subscribe(async () => {
      const alert = await this.alertCtrl.create({
        header: 'Connection Failed!',
        subHeader: 'There may be a problem in your internet connection. Please try again !',
        buttons: ['OK']
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
