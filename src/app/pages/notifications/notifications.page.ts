import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  userProfile: User;
  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.userProfile = await this.userService.getCurrentUser();
  }
}
