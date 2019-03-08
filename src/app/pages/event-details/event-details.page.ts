import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event';
import { NavController, IonContent, ModalController } from '@ionic/angular';
import { EventsService } from 'src/app/services/event/event.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ActiveUsersInEventService } from 'src/app/services/active-users-in-event.service';
import { User } from 'src/app/models/user';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  event: Event;
  eventId: string;
  isGoing: any;
  isInterested: any;
  interestedUsersCount: any;
  interestedUsers: any;
  goingUsersCount: any;
  goingUsers: any;
  user: User;

  constructor(
    private eventService: EventsService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private userService: UserService,
    private activeUsersInEventService: ActiveUsersInEventService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.user = await this.userService.getCurrentUser();
    this.getEvent();
    this.isUserInterested();
    this.isUserGoing();
    this.getActiveUsersCount();
  }

  getEvent(refresher?: any) {
    const subscription = this.eventService.getEvent(this.eventId).subscribe((event: Event) => {
      subscription.unsubscribe();
      this.event = event;
      if (refresher) refresher.target.complete();
    });
  }

  getActiveUsersCount() {
    const subscription = this.activeUsersInEventService
      .getActiveUsersCount(this.eventId)
      .subscribe((data: any) => {
        subscription.unsubscribe();
        this.interestedUsersCount = data ? data.interested : 0;
        this.goingUsersCount = data ? data.going : 0;
      });
  }

  getInterestedUsersInEvent() {
    const subscription = this.activeUsersInEventService
      .getActiveUsersInEvent(this.eventId, 'interested')
      .subscribe(users => {
        subscription.unsubscribe();
        this.interestedUsers = users;
        this.interestedUsersCount = users.length;
        this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
          interested: users.length,
        });
      });
  }

  getGoingUsersInEvent() {
    const subscription = this.activeUsersInEventService
      .getActiveUsersInEvent(this.eventId, 'going')
      .subscribe(users => {
        subscription.unsubscribe();
        this.goingUsers = users;
        this.goingUsersCount = users.length;
        this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
          going: users.length,
        });
      });
  }

  async addInterestedOrGoing(type: string) {
    try {
      if (type === 'going') ++this.goingUsersCount;
      else ++this.interestedUsersCount;
      await this.activeUsersInEventService.addInterestedOrGoing(this.eventId, this.user.uid, type);
      if (type === 'going') this.getGoingUsersInEvent();
      else this.getInterestedUsersInEvent();
    } catch (e) {
      if (type === 'going') --this.goingUsersCount;
      else --this.interestedUsersCount;
      alert(e);
    }
  }

  async removeInterestedOrGoing(type: string) {
    try {
      if (type === 'going') --this.goingUsersCount;
      else --this.interestedUsersCount;
      await this.activeUsersInEventService.removeInterestedOrGoing(
        this.eventId,
        this.user.uid,
        type
      );
      if (type === 'going') this.getGoingUsersInEvent();
      else this.getInterestedUsersInEvent();
    } catch (e) {
      if (type === 'going') ++this.goingUsersCount;
      else ++this.interestedUsersCount;
      alert(e);
    }
  }

  isUserInterested() {
    this.activeUsersInEventService
      .isInterestedOrGoing(this.eventId, this.user.uid, 'interested')
      .subscribe((data: any) => {
        this.isInterested = data ? true : false;
      });
  }

  isUserGoing() {
    this.activeUsersInEventService
      .isInterestedOrGoing(this.eventId, this.user.uid, 'going')
      .subscribe((data: any) => {
        this.isGoing = data ? true : false;
      });
  }

  showInterestedUsers() {
    if (this.interestedUsers) {
      this.showModal('interestedUsers');
    } else {
      const subscription = this.activeUsersInEventService
        .getActiveUsersInEvent(this.eventId, 'interested')
        .subscribe(users => {
          subscription.unsubscribe();
          this.interestedUsers = users;
          this.interestedUsersCount = users.length;
          this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
            interested: users.length,
          });
          this.showModal('interestedUsers');
        });
    }
  }

  showGoingUsers() {
    if (this.goingUsers) {
      this.showModal('goingUsers');
    } else {
      const subscription = this.activeUsersInEventService
        .getActiveUsersInEvent(this.eventId, 'going')
        .subscribe(users => {
          subscription.unsubscribe();
          this.goingUsers = users;
          this.goingUsersCount = users.length;
          this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
            going: users.length,
          });
          this.showModal('goingUsers');
        });
    }
  }

  async showModal(type: string) {
    const modal = await this.modalCtrl.create({
      component: UsersListComponent,
      componentProps: {
        usersUID: type === 'interestedUsers' ? this.interestedUsers : this.goingUsers,
        navTitle: type === 'interestedUsers' ? 'Interested' : 'Going',
      },
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }
}
