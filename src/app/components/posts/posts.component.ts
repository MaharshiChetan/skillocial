import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post';
import {
  NavController,
  ModalController,
  Platform,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { PostService } from 'src/app/services/post/post.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { PostLikeService } from 'src/app/services/post-like/post-like.service';
import { PostCommentService } from 'src/app/services/post-comment/post-comment.service';
import { CommentsComponent } from '../comments/comments.component';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { UsersListComponent } from '../users-list/users-list.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  @Input('posts') posts: Post[];
  showMore: boolean = false;
  fetched: any;
  uid: string;
  userProfile: User;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private postService: PostService,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private postLikeService: PostLikeService,
    private postCommentService: PostCommentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUserProfile();
  }

  async getUserProfile() {
    this.userProfile = await this.userService.getCurrentUser();
    this.uid = this.userProfile.uid;
    this.getPostsDetail();
  }

  getPostsDetail() {
    if (!this.fetched) {
      this.posts.forEach((post: any, i: number) => {
        const subscription = this.userService.getUserByUID(post.uid).subscribe((user: User) => {
          this.posts[i].createdAt = post.createdAt.toDate();
          subscription.unsubscribe();
          console.log(user);
          this.posts[i].userDetails = user;
          if (post.uid === user.uid) {
            this.posts[i].myPost = true;
          }
          this.postLikeService.checkLike(post.id, this.uid).subscribe(data => {
            this.posts[i].isLiking = data.key ? true : false;
            const likeSubscription = this.postLikeService
              .getTotalLikes(post.id)
              .subscribe(likes => {
                this.posts[i].likes = likes;
                this.posts[i].totalLikes = likes.length;
                likeSubscription.unsubscribe();
              });
          });
        });
        const commentSubscription = this.postCommentService
          .getTotalComments(post.id)
          .subscribe(comments => {
            this.posts[i].totalComments = comments.length;
            commentSubscription.unsubscribe();
          });
      });
    }
    this.fetched = true;
  }

  async showModal(users: any) {
    const modal = await this.modalCtrl.create({
      component: UsersListComponent,
      componentProps: {
        usersUID: users,
        navTitle: 'Likes',
      },
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }

  likePost(post: any) {
    this.postLikeService.likePost(post.id, this.uid);
  }

  unlikePost(post: any) {
    this.postLikeService.unlikePost(post.id, this.uid);
  }

  changeContentLength() {
    this.showMore = !this.showMore;
  }

  async presentPopover(post: any) {
    const actionsheet = await this.actionsheetCtrl.create({
      header: 'Take Action',
      buttons: [
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.editPost(post);
          },
        },
        {
          text: 'Delete',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.showConfirmAlert(post);
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    await actionsheet.present();
  }

  async showConfirmAlert(post: any) {
    const confirm = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Delete this post?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deletePost(post);
          },
        },
      ],
    });
    await confirm.present();
  }

  editPost(post: Post) {
    this.navCtrl.navigateForward(['CreatePostPage/' + post.id]);
  }

  async deletePost(post: Post) {
    await this.loadingService.show('Deleting post...');
    this.postService.deletePost(post.id);
    this.postLikeService.removePostLikes(post.id);
    this.postCommentService.removePostComments(post.id);
    if (this.posts.length < 3) {
      this.navCtrl.pop();
    }
    await this.loadingService.hide();
  }

  async openCommentsModal(post: any) {
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      componentProps: {
        post: post,
        userProfile: this.userProfile,
      },
    });
    await modal.present();
    // modal.onWillDismiss().then(data => {

    // });
  }
}