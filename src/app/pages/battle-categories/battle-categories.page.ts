import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-battle-categories',
  templateUrl: './battle-categories.page.html',
  styleUrls: ['./battle-categories.page.scss'],
})
export class BattleCategoriesPage implements OnInit {
  constructor(public eventService: EventsService) {}

  ngOnInit() {}
}
