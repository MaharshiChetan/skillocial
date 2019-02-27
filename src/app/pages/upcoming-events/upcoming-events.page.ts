import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../../services/event/event.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.page.html',
  styleUrls: ['./upcoming-events.page.scss'],
})
export class UpcomingEventsPage implements OnInit {
  events: any[];
  searchTerm: string;
  searchEvents: any[];
  placeholderImage = 'assets/placeholder.jpg';
  constructor(
    private eventService: EventsService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // this.tabsPage.showFabButton();
    this.fetchEvents();
  }

  fetchEvents(refresher?: any) {
    const subscription = this.eventService.fetchEvents().subscribe(events => {
      subscription.unsubscribe();
      this.events = events;
      this.searchEvents = this.events;
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
