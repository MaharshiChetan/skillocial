import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/event/event.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  events: any;
  currentUserProfile: any;

  constructor(
    private eventService: EventsService,
    private userService: UserService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.currentUserProfile = await this.userService.getCurrentUser();

    this.getMyEvents();
  }

  getMyEvents(refresher?: any) {
    const subscription = this.eventService
      .getMyEvents(this.currentUserProfile.uid)
      .subscribe((events: any) => {
        subscription.unsubscribe();
        this.events = events;
        if (refresher) refresher.target.complete();
      });
  }

  editEvent(eventId: string) {
    console.log(eventId);

    this.navCtrl.navigateForward(['edit-event/' + eventId]);
  }

  goToTrackEventPage(event) {}
}
