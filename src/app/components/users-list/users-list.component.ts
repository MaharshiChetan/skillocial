import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ActiveUsersInEventService } from 'src/app/services/active-users-in-event.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users: any = [];
  usersUID: any;
  navTitle: string;
  eventId: string;
  currentUserProfile: any;
  noUsers: boolean = false;
  constructor(
    private navParams: NavParams,
    private userService: UserService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private activeUsersInEventService: ActiveUsersInEventService
  ) {}

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
      const subscription = this.userService
        .getUserByUID(`${this.usersUID[i].uid}`)
        .subscribe(data => {
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

  async confirmAlert(type: string, user: any) {
    const alert = await this.alertCtrl.create({
      header: 'Participants Requests',
      message: `Are you sure want to ${type.toLowerCase()} the request?`,
      buttons: [
        { text: 'Cancel' },
        {
          text: type,
          handler: async () => {
            if (type === 'Accept') {
              this.acceptRequest(user);
            } else {
              this.rejectRequest(user);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async acceptRequest(user: any) {
    try {
      await this.loadingService.show();
      await this.activeUsersInEventService.addActiveUser(
        this.eventId,
        this.currentUserProfile.uid,
        'participants'
      );
      this.updateActiveUsersCount('participants');
      this.rejectRequest(user);
      await this.loadingService.hide();
    } catch (error) {
      console.log(error);
    }
  }

  async rejectRequest(user: any) {
    try {
      await this.activeUsersInEventService.removeActiveUser(
        this.eventId,
        user.uid,
        'participantsRequest'
      );
      this.updateActiveUsersCount('participantsRequest');
    } catch (e) {
      alert(e);
    }
  }

  updateActiveUsersCount(type: string) {
    const subscription = this.activeUsersInEventService
      .getActiveUsers(this.eventId, type)
      .subscribe(async activeUsers => {
        subscription.unsubscribe();
        await this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
          [type]: activeUsers.length,
        });
      });
  }
}
