import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  options: any;
  constructor(private navParams: NavParams, private popoverCtrl: PopoverController) {}

  ngOnInit() {
    const currentUser: boolean = this.navParams.get('currentUser');
    this.fillPopoverOptions(currentUser);
  }

  fillPopoverOptions(currentUser: boolean): any {
    if (currentUser) {
      this.options = [
        'Leaderboard',
        'Invite Friends',
        'Share',
        'My Events',
        'My Requests',
        'Edit Profile',
        'Settings',
      ];
      return;
    }
    this.options = ['Drop', 'Message', 'Share', 'Report', 'Block'];
  }

  optionSelected(option: any) {
    this.popoverCtrl.dismiss(option);
  }
}
