import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BlockUserService } from 'src/app/services/block-user/block-user.service';
import { User } from 'src/app/models/user';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  currentUserProfile: User;
  blockedUsers: any;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private blockUserService: BlockUserService
  ) {}

  async ngOnInit() {
    this.currentUserProfile = await this.userService.getCurrentUser();
    console.log(this.currentUserProfile);
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        userProfile: this.currentUserProfile
      },
      animated: false
    });
    await modal.present();
  }

  async onLogout() {
    const user: any = this.userService.getCurrentUser();
    if (user) {
      if (user.loginType === 'google') {
        try {
          await this.authService.googleLogout();
          this.logout();
        } catch (error) {
          alert('logout:' + error);
          this.logout();
        }
      } else if (user.loginType === 'facebook') {
        try {
          await this.authService.facebookLogout();
          this.logout();
        } catch (error) {
          alert('logout:' + error);
          this.logout();
        }
      } else {
        this.logout();
      }
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.userService.removeCurrentUser();
      await this.navCtrl.navigateRoot('login');
    } catch (error) {
      console.log(error);
    }
  }

  async showConfirmAlert() {
    const confirm = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'desctructive'
        },
        {
          text: 'Sign Out',
          handler: () => {
            this.onLogout();
          }
        }
      ]
    });
    await confirm.present();
  }

  getBlockedUsers() {
    const subscription = this.blockUserService.getBlockedUsers(this.currentUserProfile.uid).subscribe(blockedUsers => {
      subscription.unsubscribe();
      this.blockedUsers = blockedUsers.length > 0 ? blockedUsers : false;
      this.showBlockedUsers();
    });
  }

  async showBlockedUsers() {
    const modal = await this.modalCtrl.create({
      component: UsersListComponent,
      componentProps: {
        usersUID: this.blockedUsers,
        navTitle: 'Blocked Accounts'
      },
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }
}
