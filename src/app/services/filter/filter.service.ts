import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor() {}

  filterMessages(messages: any, searchTerm: any) {
    return messages.filter((message: any) => {
      return message.username.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  filterEvents(events: any, searchTerm: any) {
    return events.filter((event: any) => {
      return event.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
