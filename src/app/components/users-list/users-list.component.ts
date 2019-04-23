import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ActiveUsersInEventService } from 'src/app/services/active-users-in-event.service/active-users-in-event.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: any = [];
  usersUID: any;
  navTitle: string;
  eventId: string;
  currentUserProfile: any;
  noUsers: boolean = false;

  constructor(private navParams: NavParams, private userService: UserService, private modalCtrl: ModalController) {}

  async ngOnInit() {
    this.usersUID = this.navParams.get('usersUID');
    this.navTitle = this.navParams.get('navTitle');
    this.eventId = this.navParams.get('eventId');
    this.currentUserProfile = await this.userService.getCurrentUser();
    this.getUsersByUID();
  }

  getUsersByUID() {
    for (let i = this.users.length; i < this.users.length + 10; i++) {
      // this.initializeInterestedLoader();
      if (i >= this.usersUID.length) {
        break;
      }
      const subscription = this.userService.getUserByUID(`${this.usersUID[i].uid}`).subscribe(data => {
        subscription.unsubscribe();
        this.users.push(data);
      });
    }
  }

  doInfinite(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async dismissModal() {
    await this.modalCtrl.dismiss();
  }
}
