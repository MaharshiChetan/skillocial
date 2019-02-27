import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  navbarTitle: string = 'Home';
  userProfile: User;
  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.userProfile = await this.userService.getCurrentUser();
  }

  tabChanged(event: any) {
    if (event.tab === 'upcoming-events') {
      this.navbarTitle = 'Upcoming Events';
    } else if (event.tab === 'chat-list') {
      this.navbarTitle = 'Chats';
    } else {
      this.navbarTitle = 'Home';
    }
  }
}
