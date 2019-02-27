import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../../services/event/event.service';
import { NavController } from '@ionic/angular';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.page.html',
  styleUrls: ['./upcoming-events.page.scss'],
})
export class UpcomingEventsPage implements OnInit {
  upcomingEvents: Event[];
  searchTerm: string;
  searchEvents: any[];
  placeholderImage = 'assets/placeholder.jpg';
  constructor(
    private eventService: EventsService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getEvents();
  }

  getEvents(refresher?: any) {
    const subscription = this.eventService.getEvents().subscribe((events: any) => {
      subscription.unsubscribe();
      this.upcomingEvents = events;
      this.searchEvents = this.upcomingEvents;
      if (refresher) refresher.target.complete();
    });
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  goToCreateEventPage() {
    // this.loadingService.show();
    // this.app.getRootNav().push('CreateEventPage');
  }

  setFilteredItems(event) {
    // this.events = this.dataService.filterEvents(this.searchEvents, this.searchTerm);
  }
}
