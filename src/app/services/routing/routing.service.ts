import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  tabsLastUrl: string = '/tabs/home';
  constructor() {}
}
