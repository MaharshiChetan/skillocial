import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController, ActionSheetController, Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { User } from 'src/app/models/user';
import * as _ from 'lodash';
import * as moment from 'moment';
import { RoutingService } from 'src/app/services/routing/routing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {
  userProfile: User;
  messages: boolean;
  displayMessages: any;
  searchMessages: any;
  searchTerm: string = '';

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private platform: Platform,
    private chatService: ChatService,
    private filterService: FilterService,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private routingService: RoutingService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.userProfile = await this.userService.getCurrentUser();
    this.getDisplayMessages();
    // this.initializeLoader();
  }

  getDisplayMessages(event?: any) {
    const subscription = this.chatService
      .getDisplayMessages(this.userProfile.uid)
      .subscribe(displayMessages => {
        // subscription.unsubscribe();
        if (displayMessages.length > 0) this.messages = true;
        else this.messages = false;
        if (event) event.target.complete();

        this.displayMessages = _.sortBy(displayMessages, function(o) {
          return moment(o['timeStamp']);
        }).reverse();
        this.searchMessages = this.displayMessages;
      });
  }

  deleteAllMessages(message: any) {
    this.chatService.deleteAllMessages(this.userProfile.uid, message.id);
  }

  async showActionSheet(message: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Take Action',
      buttons: [
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.deleteAllMessages(message);
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
        },
      ],
    });
    return await actionSheet.present();
  }

  setFilteredItems() {
    this.displayMessages = this.filterService.filterMessages(this.searchMessages, this.searchTerm);
  }

  async onLogout() {
    const user: any = this.userService.getCurrentUser();
    if (user) {
      if (user.loginType === 'google') {
        try {
          await this.authService.googleLogout();
          this.logout();
        } catch (error) {
          alert('logout:' + error);
          this.logout();
        }
      } else if (user.loginType === 'facebook') {
        try {
          await this.authService.facebookLogout();
          this.logout();
        } catch (error) {
          alert('logout:' + error);
          this.logout();
        }
      } else if (user.loginType === 'twitter') {
        this.logout();
      } else {
        this.logout();
      }
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.userService.removeCurrentUser();
      this.navCtrl.navigateRoot('login');
    } catch (error) {
      console.log(error);
    }
  }

  popBack() {
    this.navCtrl.navigateBack([this.routingService.tabsLastUrl]);
  }
}
