import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

import { IonicModule } from '@ionic/angular';

import { UpcomingEventsPage } from './upcoming-events.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: UpcomingEventsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
    FontAwesomeModule
  ],
  declarations: [UpcomingEventsPage],
})
export class UpcomingEventsPageModule { }
