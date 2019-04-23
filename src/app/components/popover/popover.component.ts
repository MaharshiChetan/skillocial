import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { FollowService } from 'src/app/services/follow/follow.service';
import { BlockUserService } from 'src/app/services/block-user/block-user.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  options: any;
  currentUser: boolean;
  userProfile: User;
  blockedUser: any;
  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private followService: FollowService,
    private bloackUserService: BlockUserService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.navParams.get('currentUser');
    this.userProfile = this.navParams.get('userProfile');
    if (!this.currentUser) {
      this.isBlockedUser();
    }
    this.fillPopoverOptions();
  }

  isBlockedUser() {
    this.bloackUserService
      .isBlockedUser(this.userService.currentUserProfile.uid, this.userProfile.uid)
      .subscribe(data => {
        this.blockedUser = data.length > 0 ? data : false;
        this.fillPopoverOptions();
      });
  }

  fillPopoverOptions(): any {
    if (this.currentUser) {
      this.options = [
        { name: 'Invite Friends', route: 'invite-friends' },
        { name: 'My Events', route: 'my-events' },
        { name: 'My Requests', route: 'my-requests' },
        { name: 'Edit Profile', route: 'edit-profile' },
        { name: 'Settings', route: 'settings' }
      ];
    } else {
      this.options = [
        this.followService.isFollowing ? { name: 'Unfollow' } : { name: 'Follow' },
        { name: 'Message', route: 'user-chats' },
        { name: 'Share' },
        { name: 'Report', route: 'report' },
        { name: this.blockedUser ? 'Unblock' : 'Block', blockedUser: this.blockedUser }
      ];
    }
  }

  optionSelected(option: any) {
    this.popoverCtrl.dismiss(option);
  }
}
