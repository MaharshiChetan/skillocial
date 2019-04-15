import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user/user.service";
import { User } from "src/app/models/user";
import { FollowService } from "src/app/services/follow/follow.service";
import { PostService } from "src/app/services/post/post.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  currentUserProfile: any;
  userProfile: User;
  posts: any = [];
  post: boolean;
  followings: any;
  constructor(
    private userService: UserService,
    private followService: FollowService,
    private postService: PostService
  ) {}

  async ngOnInit() {
    this.getCurrentUserProfile();
  }

  getFollowings() {
    const followingSubscription = this.followService
      .getFollowings(this.currentUserProfile.uid)
      .subscribe(followings => {
        followingSubscription.unsubscribe();
        this.followings = followings;
        this.post = followings.length === 0 ? true : false;
        followings.forEach(user => {
          this.getPosts(user.uid);
        });
      });
  }

  getPosts(uid: string) {
    this.posts = [];
    this.post = false;
    const postSubscription = this.postService.getRecentPosts(uid).subscribe((post: any) => {
      postSubscription.unsubscribe();
      console.log(post);
      this.posts.push(...post);
      this.post = true;
    });
  }

  async getCurrentUserProfile(refresher?: any) {
    this.currentUserProfile = await this.userService.getCurrentUser();
    this.userProfile = this.currentUserProfile;
    this.getFollowings();
    if (this.currentUserProfile) {
      const subscription = this.userService.getUserByUID(this.currentUserProfile.uid).subscribe((user: User) => {
        subscription.unsubscribe();
        this.userProfile = user;
        if (refresher) refresher.target.complete();
      });
    }
  }
}
