import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../models/user';
import { RegisterCredentials } from '../../models/registerCredentials';
import { LoginCredentials } from '../../models/loginCredentials';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TwitterConnect, TwitterConnectResponse } from '@ionic-native/twitter-connect/ngx';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState: any;
  constructor(
    private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private facebook: Facebook,
    private twitterConnect: TwitterConnect
  ) {
    afAuth.authState.subscribe((authState: any) => {
      this.authState = authState;
    });
  }

  emailSignUp(credentials: RegisterCredentials): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  emailLogin(credentials: LoginCredentials): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  async simpleGoogleLogin(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  async simpleFacebookLogin(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  sendEmailVerification() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  cordovaGoogleLogin(): Promise<any> {
    return this.googlePlus.login({
      webClientId: environment.googleWebClientId, // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      offline: true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    });
  }

  cordovaFacebookLogin(): Promise<FacebookLoginResponse> {
    //the permissions your facebook app needs from the user
    const permissions = ['public_profile', 'email'];
    return this.facebook.login(permissions);
  }

  cordovaTwitterLogin(): Promise<TwitterConnectResponse> {
    return this.twitterConnect.login();
  }

  signInWithFacebookCredential(facebookCredential: any): Promise<firebase.User> {
    return this.afAuth.auth.signInWithCredential(facebookCredential);
  }

  signInWithTwitterCredential(twitterCredential: any): Promise<firebase.User> {
    return this.afAuth.auth.signInWithCredential(twitterCredential);
  }

  signInWithGoogleCredential(googleCredential: any): Promise<firebase.User> {
    return this.afAuth.auth.signInWithCredential(googleCredential);
  }

  async googleLogout(): Promise<any> {
    return this.googlePlus.logout();
  }

  facebookLogout(): Promise<any> {
    return this.facebook.logout();
  }

  twitterLogout() {}

  logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  updateUserProfile(user: User): Promise<void> {
    return this.afAuth.auth.currentUser.updateProfile({
      displayName: user.fullName,
      photoURL: user.profilePhoto,
    });
  }

  // Returns current user
  get currentUser(): any {
    return this.authenticated ? this.authState.auth : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }
  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }
}
