import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/models/user';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUserProfile: User;
  constructor(
    private afStore: AngularFirestore,
    private storage: Storage,
    private nativeStorage: NativeStorage,
    private platform: Platform
  ) {
    this.getCurrentUser().then((user: User) => {
      this.currentUserProfile = user;
    });
  }

  async addUser(user: User): Promise<any> {
    return this.afStore
      .collection('users')
      .doc(user.uid)
      .set(user);
  }

  async updateUser(user: User, uid: string): Promise<any> {
    return this.afStore
      .collection('users')
      .doc(uid)
      .update(user);
  }

  checkUsername(username: string) {
    return this.afStore.collection('users', ref => ref.where('username', '==', username).limit(1)).valueChanges();
  }

  getUserByUID(uid: string) {
    return this.afStore
      .collection('users')
      .doc(uid)
      .valueChanges();
  }

  getCurrentUser() {
    if (this.platform.is('cordova')) {
      return this.nativeStorage.getItem('user');
    } else {
      return this.storage.get('user');
    }
  }

  removeCurrentUser() {
    if (this.platform.is('cordova')) {
      return this.nativeStorage.remove('user');
    } else {
      return this.storage.remove('user');
    }
  }

  async storeUserData(user: any): Promise<any> {
    if (this.platform.is('cordova')) {
      return this.nativeStorage.setItem('user', user);
    }
    return this.storage.set('user', user);
  }

  getUserData(userData: any, type: string): any {
    return {
      fullName: userData.displayName,
      email: userData.email,
      profilePhoto: userData.photoURL || 'https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
      uid: userData.uid,
      username: userData.email.substring(0, userData.email.lastIndexOf('@')),
      loginType: type,
      bio: "Hey! I'm using skillocial."
    };
  }
}
