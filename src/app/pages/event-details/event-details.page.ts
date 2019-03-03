import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event';
import { NavController, IonContent } from '@ionic/angular';
import { EventsService } from 'src/app/services/event/event.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

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
  interestedUsers: any;
  goingUsers: any;
  uid: any;

  constructor(
    private eventService: EventsService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    const user = await this.userService.getCurrentUser();
    this.uid = user.uid;
    // this.eventId = '5uiXhmvuvVCoUL4RqqJL';
    this.getEvent();
    this.getActiveUsersCount();
    this.isCurrentUserInterested();
    this.isCurrentUserGoing();
  }

  getEvent(refresher?: any) {
    const subscription = this.eventService.getEvent(this.eventId).subscribe((event: Event) => {
      subscription.unsubscribe();
      this.event = event;
      if (refresher) refresher.target.complete();
    });
  }

  async addInterested() {
    if (this.uid) {
      try {
        this.loadingService.show();
        if (this.isGoing) this.removeGoing();
        await this.eventService.addUserToInterested(this.uid, this.eventId);
        this.incrementActiveUsersCount('interested');
      } catch (error) {
        this.loadingService.hide();
        console.log(error);
      }
    }
  }

  async addGoing() {
    if (this.uid) {
      try {
        this.loadingService.show();
        if (this.isInterested) this.removeInterested();
        await this.eventService.addUserToGoing(this.uid, this.eventId);
        this.incrementActiveUsersCount('going');
      } catch (error) {
        this.loadingService.hide();
        console.log(error);
      }
    }
  }

  async incrementActiveUsersCount(type: string) {
    try {
      if (type === 'interested') {
        await this.eventService.updateActiveUsersCount(
          this.eventId,
          ++this.interestedUsers,
          this.goingUsers
        );
      } else {
        await this.eventService.updateActiveUsersCount(
          this.eventId,
          this.interestedUsers,
          ++this.goingUsers
        );
      }
      this.loadingService.hide();
    } catch (error) {
      this.loadingService.hide();
      console.log(error);
    }
  }

  async decrementActiveUsersCount(type: string) {
    try {
      if (type === 'interested') {
        await this.eventService.updateActiveUsersCount(
          this.eventId,
          --this.interestedUsers,
          this.goingUsers
        );
        this.loadingService.hide();
      } else {
        await this.eventService.updateActiveUsersCount(
          this.eventId,
          this.interestedUsers,
          --this.goingUsers
        );
        this.loadingService.hide();
      }
    } catch (error) {
      console.log(error);
    }
  }

  getActiveUsersCount() {
    this.eventService.getActiveUsersCount(this.eventId).subscribe((activeUsersCount: any) => {
      this.interestedUsers = activeUsersCount ? activeUsersCount.interestedUsers : 0;
      this.goingUsers = activeUsersCount ? activeUsersCount.goingUsers : 0;
    });
  }

  isCurrentUserGoing() {
    if (this.uid) {
      this.eventService.isUserGoing(this.uid, this.eventId).subscribe(data => {
        if (!data || data.length === 0) {
          this.isGoing = false;
        } else {
          this.isGoing = data;
        }
      });
    }
  }

  isCurrentUserInterested() {
    if (this.uid) {
      this.eventService.isUserInterested(this.uid, this.eventId).subscribe(data => {
        if (!data || data.length === 0) {
          this.isInterested = false;
        } else {
          this.isInterested = data;
        }
      });
    }
  }

  async removeInterested() {
    try {
      await this.eventService.removeInterested(this.isInterested[0].id);
      this.decrementActiveUsersCount('interested');
    } catch (error) {
      this.loadingService.hide();
      console.log(error);
    }
  }

  async removeGoing() {
    try {
      await this.eventService.removeGoing(this.isGoing[0].id);
      this.decrementActiveUsersCount('going');
    } catch (error) {
      this.loadingService.hide();
      console.log(error);
    }
  }
}
