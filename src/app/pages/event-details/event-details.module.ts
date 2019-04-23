import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { EventDetailsPage } from './event-details.page';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: EventDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    ComponentsModule
  ],
  declarations: [EventDetailsPage]
})
export class EventDetailsPageModule {}
