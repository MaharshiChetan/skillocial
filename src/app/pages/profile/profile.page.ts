import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { PopoverController, ModalController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ActivatedRoute } from '@angular/router';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  userProfile: User;
  currentUserProfile: User;
  constructor(
    private userService: UserService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private photoViewer: PhotoViewer
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.currentUserProfile = await this.userService.getCurrentUser();
    if (this.uid) {
      this.getUserProfile();
    } else {
      this.uid = this.currentUserProfile.uid;
      this.getUserProfile();
    }
  }

  showPhoto(imageUrl: string, title: string) {
    this.photoViewer.show(imageUrl, title, { share: false });
  }

  getUserProfile(refresher?: any) {
    const subscription = this.userService.getUserByUID(this.uid).subscribe((user: User) => {
      this.userProfile = user;
      if (refresher) refresher.target.complete();
      subscription.unsubscribe();
    });
  }

  async presentPopover() {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {
        currentUser: this.userProfile.uid === this.currentUserProfile.uid ? true : false,
      },
      event: event,
    });
    await popover.present();

    const value = await popover.onWillDismiss();
    console.log(value);
    if (value.role !== 'backdrop') {
      if (value.data.name === 'Edit Profile') {
        const modal = await this.modalCtrl.create({
          component: EditProfileComponent,
          componentProps: {
            userProfile: this.userProfile,
          },
        });
        modal.present();
        modal.onWillDismiss().then(data => {
          if (data) this.getUserProfile();
        });
      } else if (value.data.name === 'Message') {
        this.navCtrl.navigateForward([`${value.data.route}/${this.uid}`]);
      } else {
        this.navCtrl.navigateForward([value.data.route]);
      }
    }
  }
}
