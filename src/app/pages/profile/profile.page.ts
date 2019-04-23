import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { PopoverController, ModalController, NavController, AlertController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ActivatedRoute } from '@angular/router';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { FollowService } from 'src/app/services/follow/follow.service';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TitleService } from 'src/app/services/title/title.service';
import { Title } from '@angular/platform-browser';
import { PostService } from 'src/app/services/post/post.service';
import { Post } from 'src/app/models/post';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { BlockUserService } from 'src/app/services/block-user/block-user.service';
import { firestore } from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  uid: string;
  userProfile: User;
  type: string = 'posts';
  currentUserProfile: User;
  followersCount: any;
  followingsCount: number;
  likesCount: any;
  followers: { uid: string }[];
  followings: { uid: string }[];
  isFollowing: boolean;
  titles: Title[];
  posts: Post[];

  constructor(
    private userService: UserService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private followService: FollowService,
    private loadingService: LoadingService,
    private alertCtrl: AlertController,
    private titleService: TitleService,
    private postService: PostService,
    private blockUserService: BlockUserService,
    public photoViewer: PhotoViewer
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.currentUserProfile = await this.userService.getCurrentUser();
    if (!this.uid) {
      this.uid = this.currentUserProfile.uid;
    }
    this.getUserProfile();
  }

  getUserProfile(refresher?: any) {
    const subscription = this.userService.getUserByUID(this.uid).subscribe((user: User) => {
      subscription.unsubscribe();
      this.userProfile = user;
      if (refresher) refresher.target.complete();
    });
    this.getFollowCount();
    this.isUserFollowing();
    this.getTitles();
    this.getPosts();
  }

  async presentPopover() {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      componentProps: {
        currentUser: this.userProfile.uid === this.currentUserProfile.uid ? true : false,
        userProfile: this.userProfile
      },
      event: event
    });
    await popover.present();

    const value = await popover.onWillDismiss();
    if (value.role !== 'backdrop') {
      if (value.data.name === 'Edit Profile') {
        this.editProfile();
      } else if (value.data.name === 'Message') {
        await this.navCtrl.navigateForward([`${value.data.route}/${this.uid}`]);
      } else if (value.data.name === 'Unfollow') {
        this.unfollow();
      } else if (value.data.name === 'Follow') {
        this.follow();
      } else if (value.data.name === 'Block') {
        this.blockUser();
      } else if (value.data.name === 'Unblock') {
        console.log(value.data.blockedUser);
        this.unblockUser(value.data.blockedUser);
      } else {
        await this.navCtrl.navigateForward([value.data.route]);
      }
    }
  }

  async blockUser() {
    let alertPopup = await this.alertCtrl.create({
      header: `Block ${this.userProfile.username}`,
      message: `They won't be able to find your profile or posts on Skillocial. Skillocial won't let them know you blocked them.`,
      buttons: [
        { text: 'Cancel', role: 'destructive' },
        {
          text: 'Block',
          handler: async () => {
            try {
              const blockUserDetails = {
                blockedByUID: this.currentUserProfile.uid,
                blockedUID: this.userProfile.uid,
                uid: this.userProfile.uid,
                timeStamp: firestore.FieldValue.serverTimestamp()
              };
              await this.blockUserService.blockUser(blockUserDetails);
              this.successBlockAlert();
            } catch (error) {
              console.log(error);
            }
          }
        }
      ]
    });
    await alertPopup.present();
  }

  async unblockUser(blockedUser: any) {
    let alertPopup = await this.alertCtrl.create({
      header: `Unblock ${this.userProfile.username}`,
      message: `They will now be able to find your profile or posts on Skillocial. Skillocial won't let them know you unblocked them.`,
      buttons: [
        { text: 'Cancel', role: 'destructive' },
        {
          text: 'Unblock',
          handler: async () => {
            try {
              await this.blockUserService.unblockUser(blockedUser[0].id);
              this.successUnblockAlert();
            } catch (error) {
              console.log(error);
            }
          }
        }
      ]
    });
    await alertPopup.present();
  }

  async successBlockAlert() {
    let alertPopup = await this.alertCtrl.create({
      header: `${this.userProfile.username} Blocked`,
      message: `You can unblock them anytime from their profile`,
      buttons: [{ text: 'OK', role: 'destructive' }]
    });
    await alertPopup.present();
  }

  async successUnblockAlert() {
    let alertPopup = await this.alertCtrl.create({
      header: `${this.userProfile.username} Unblocked`,
      message: `You can block them anytime from their profile`,
      buttons: [{ text: 'OK', role: 'destructive' }]
    });
    await alertPopup.present();
  }

  getFollowCount() {
    const subscription = this.followService.getFollowCount(this.uid).subscribe((data: any) => {
      subscription.unsubscribe();
      if (data) {
        this.followersCount = data.followersCount;
        this.followingsCount = data.followingsCount;
      }
    });
  }

  isUserFollowing() {
    this.followService.isUserFollowing(this.currentUserProfile.uid, this.uid).subscribe((data: any) => {
      this.isFollowing = data ? true : false;
      this.followService.isFollowing = this.isFollowing;
    });
  }

  updateFollowCount() {
    const followersSubscription = this.followService.getFollowers(this.uid).subscribe(followers => {
      const followingsSubscription = this.followService
        .getFollowings(this.currentUserProfile.uid)
        .subscribe(followings => {
          followersSubscription.unsubscribe();
          followingsSubscription.unsubscribe();
          this.followersCount = followers.length;
          this.followers = followers;

          this.followService.updateFollowCount(this.currentUserProfile.uid, this.uid, {
            followersCount: followers.length,
            followingsCount: followings.length
          });
        });
    });
  }

  follow() {
    try {
      ++this.followersCount;
      this.followService.follow(this.currentUserProfile.uid, this.userProfile.uid);
      this.updateFollowCount();
    } catch (error) {
      --this.followersCount;
      console.log(error);
    }
  }

  async unfollow() {
    let alertPopup = await this.alertCtrl.create({
      header: 'Unfollow?',
      message: `Are you sure for not follwing ${this.userProfile.username} any more!`,
      buttons: [
        { text: 'Cancel', role: 'destructive' },
        {
          text: 'Unfollow',
          handler: async () => {
            try {
              --this.followersCount;
              this.followService.unfollow(this.currentUserProfile.uid, this.userProfile.uid);
              this.updateFollowCount();
            } catch (error) {
              ++this.followersCount;
              console.log(error);
            }
          }
        }
      ]
    });
    await alertPopup.present();
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        userProfile: this.userProfile
      },
      animated: false
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    if (data) this.getUserProfile();
  }

  async showFollowers() {
    await this.loadingService.show();
    if (this.followers) {
      this.showModal('followers');
    } else {
      const subscription = this.followService.getFollowers(this.uid).subscribe(followers => {
        subscription.unsubscribe();
        this.followers = followers;
        this.followersCount = followers.length;
        this.showModal('followers');
      });
    }
  }

  async showFollowings() {
    await this.loadingService.show();
    if (this.followings) {
      this.showModal('followings');
    } else {
      const subscription = this.followService.getFollowings(this.uid).subscribe(followings => {
        subscription.unsubscribe();
        this.followings = followings;
        this.followingsCount = followings.length;
        this.showModal('followings');
      });
    }
  }

  async showModal(type: string) {
    await this.loadingService.hide();
    const modal = await this.modalCtrl.create({
      component: UsersListComponent,
      componentProps: {
        usersUID: type === 'followers' ? this.followers : this.followings,
        navTitle: type === 'followers' ? 'Followers' : 'Followings'
      },
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }

  getTitles() {
    const subscription = this.titleService.getTopSixTitles(this.uid).subscribe((titles: any) => {
      subscription.unsubscribe();
      this.titles = titles;
    });
  }

  getPosts() {
    const subscription = this.postService.getTopNinePosts(this.uid).subscribe((posts: any) => {
      subscription.unsubscribe();
      this.posts = posts;
    });
  }
}
