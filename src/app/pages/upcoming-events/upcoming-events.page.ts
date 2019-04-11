import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/event/event.service';
import { Event } from 'src/app/models/event';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { FilterService } from 'src/app/services/filter/filter.service';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.page.html',
  styleUrls: ['./upcoming-events.page.scss'],
})
export class UpcomingEventsPage implements OnInit {
  upcomingEvents: Event[];
  searchTerm: string;
  searchEvents: any[];
  userProfile: User;

  constructor(
    private eventService: EventsService,
    private filterService: FilterService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.getEvents();
    this.userProfile = await this.userService.getCurrentUser();
  }

  getEvents(refresher?: any) {
    const subscription = this.eventService.getEvents('pending').subscribe((events: any) => {
      subscription.unsubscribe();
      this.upcomingEvents = events;
      this.searchEvents = this.upcomingEvents;
      if (refresher) refresher.target.complete();
    });
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  setFilteredItems() {
    this.upcomingEvents = this.filterService.filterEvents(this.searchEvents, this.searchTerm);
  }
}
