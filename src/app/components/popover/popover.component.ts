import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ViewController } from '@ionic/core';
import { FollowService } from 'src/app/services/follow/follow.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  options: any;
  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private followService: FollowService
  ) {}

  ngOnInit() {
    const currentUser: boolean = this.navParams.get('currentUser');
    this.fillPopoverOptions(currentUser);
  }

  fillPopoverOptions(currentUser: boolean): any {
    console.log(this.followService.isFollowing);

    if (currentUser) {
      this.options = [
        { name: 'Invite Friends', route: 'invite-friends' },
        { name: 'My Events', route: 'my-events' },
        { name: 'My Requests', route: 'my-requests' },
        { name: 'Edit Profile', route: 'edit-profile' },
        { name: 'Settings', route: 'settings' },
      ];
    } else {
      this.options = [
        this.followService.isFollowing ? { name: 'Unfollow' } : { name: 'Follow' },
        { name: 'Message', route: 'user-chats' },
        { name: 'Share' },
        { name: 'Report', route: 'report' },
        { name: 'Block' },
      ];
    }
  }

  optionSelected(option: any) {
    this.popoverCtrl.dismiss(option);
  }
}
