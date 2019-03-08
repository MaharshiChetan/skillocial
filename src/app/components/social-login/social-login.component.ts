import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController, Platform } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as firebase from 'firebase';
import { FacebookLoginResponse } from '@ionic-native/facebook/ngx';
// import { TwitterConnectResponse } from '@ionic-native/twitter-connect/ngx';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss'],
})
export class SocialLoginComponent implements OnInit {
  @Input('type') type: string;
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private platform: Platform,
    private toastService: ToastService,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  async googleLogin() {
    await this.loadingService.show();
    if (!this.platform.is('cordova')) {
      try {
        const googleUser: firebase.auth.UserCredential = await this.authService.simpleGoogleLogin();
        const user = this.userService.getUserData(googleUser.user, 'google');
        const subscription = this.userService
          .getUserByUID(googleUser.user.uid)
          .subscribe(async (userProfile: any) => {
            subscription.unsubscribe();
            if (!userProfile) {
              await this.userService.addUser(user);
            }
            //now we have the users info, let's save it in the NativeStorage
            await this.userService.storeUserData(user);
            await this.loadingService.hide();
            this.toastService.showToast('Congratulations! You have successfully logged in.', 'top');
            this.navCtrl.navigateRoot('tabs');
          });
      } catch (error) {
        await this.loadingService.hide();
        alert(error);
      }
    } else {
      try {
        const res: any = await this.authService.cordovaGoogleLogin();
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(null, res.accessToken);
        let googleUser: any = await this.authService.signInWithGoogleCredential(googleCredential);
        googleUser = JSON.parse(JSON.stringify(googleUser));
        const user = this.userService.getUserData(googleUser, 'google');
        const subscription = this.userService
          .getUserByUID(googleUser.uid)
          .subscribe(async (userProfile: any) => {
            subscription.unsubscribe();
            if (!userProfile) {
              await this.userService.addUser(user);
            }
            //now we have the users info, let's save it in the NativeStorage
            await this.userService.storeUserData(user);
            await this.loadingService.hide();
            this.toastService.showToast('Congratulations! You have successfully logged in.', 'top');
            this.navCtrl.navigateRoot('tabs');
          });
      } catch (error) {
        await this.loadingService.hide();
        alert('Error: ' + error);
      }
    }
  }

  async facebookLogin() {
    await this.loadingService.show();
    if (!this.platform.is('cordova')) {
      try {
        const facebookUser: firebase.auth.UserCredential = await this.authService.simpleFacebookLogin();
        const user = this.userService.getUserData(facebookUser.user, 'facebook');
        const subscription = this.userService
          .getUserByUID(facebookUser.user.uid)
          .subscribe(async (userProfile: any) => {
            subscription.unsubscribe();
            if (!userProfile) {
              await this.userService.addUser(user);
            }
            //now we have the users info, let's save it in the NativeStorage
            await this.userService.storeUserData(user);
            await this.loadingService.hide();
            this.toastService.showToast('Congratulations! You have successfully logged in.', 'top');
            this.navCtrl.navigateRoot('tabs');
          });
      } catch (error) {
        await this.loadingService.hide();
        alert(error);
      }
    } else {
      try {
        const response: FacebookLoginResponse = await this.authService.cordovaFacebookLogin();
        const userId = response.authResponse.userID;
        const facebookCredential: firebase.auth.AuthCredential = firebase.auth.FacebookAuthProvider.credential(
          response.authResponse.accessToken
        );
        const userData = await this.authService.signInWithFacebookCredential(facebookCredential);
        const user = this.userService.getUserData(userData, 'facebook');
        user.profilePhoto = 'https://graph.facebook.com/' + userId + '/picture?type=large';
        const subscription = this.userService
          .getUserByUID(userData.uid)
          .subscribe(async (userProfile: any) => {
            subscription.unsubscribe();
            if (!userProfile) {
              await this.userService.addUser(user);
            }
            //now we have the users info, let's save it in the NativeStorage
            await this.userService.storeUserData(user);
            await this.loadingService.hide();
            this.toastService.showToast('Congratulations! You have successfully logged in.', 'top');
            this.navCtrl.navigateRoot('tabs');
          });
      } catch (error) {
        await this.loadingService.hide();
        alert(error);
      }
    }
  }

  /* async twitterLogin() {
    await this.loadingService.show();
    try {
      const response: TwitterConnectResponse = await this.authService.cordovaTwitterLogin();
      const twitterCredential: firebase.auth.AuthCredential = firebase.auth.TwitterAuthProvider.credential(
        response.token,
        response.secret
      );
      const userProfile = await this.authService.signInWithTwitterCredential(twitterCredential);
      await this.loadingService.hide();
      alert(JSON.stringify(userProfile));
    } catch (error) {
      await this.loadingService.hide();
      alert(error);
    }
  } */
}
