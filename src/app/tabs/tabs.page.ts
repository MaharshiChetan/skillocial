import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';
import { RoutingService } from '../services/routing/routing.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  userProfile: User;
  constructor(private userService: UserService, private routingService: RoutingService, public platform: Platform) {}

  async ngOnInit() {
    this.userProfile = await this.userService.getCurrentUser();
  }

  tabChange(event: any) {
    this.routingService.tabsLastUrl = '/tabs/' + event.tab;
  }
}
