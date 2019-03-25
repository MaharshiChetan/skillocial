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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  userProfile: User;
  type: string = 'posts';
  currentUserProfile: User;
  followersCount: any;
  followers: { uid: string }[];
  followings: { uid: string }[];
  followingsCount: number;
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
    private postService: PostService
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

  getUserProfile(refresher?: any) {
    const subscription = this.userService.getUserByUID(this.uid).subscribe((user: User) => {
      this.userProfile = user;
      if (refresher) refresher.target.complete();
      subscription.unsubscribe();
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
      },
      event: event,
    });
    await popover.present();

    const value = await popover.onWillDismiss();
    if (value.role !== 'backdrop') {
      if (value.data.name === 'Edit Profile') {
        this.editProfile();
      } else if (value.data.name === 'Message') {
        this.navCtrl.navigateForward([`${value.data.route}/${this.uid}`]);
      } else if (value.data.name === 'Unfollow') {
        this.unfollow();
      } else if (value.data.name === 'Follow') {
        this.follow();
      } else {
        this.navCtrl.navigateForward([value.data.route]);
      }
    }
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
    this.followService
      .isUserFollowing(this.currentUserProfile.uid, this.uid)
      .subscribe((data: any) => {
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
            followingsCount: followings.length,
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
          },
        },
      ],
    });
    await alertPopup.present();
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        userProfile: this.userProfile,
      },
      animated: false,
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
        navTitle: type === 'followers' ? 'Followers' : 'Followings',
      },
      animated: false,
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
