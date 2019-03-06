import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateEventPage } from './create-event.page';
import { AutosizeModule } from 'ngx-autosize';

const routes: Routes = [
  {
    path: '',
    component: CreateEventPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    AutosizeModule,
  ],
  declarations: [CreateEventPage],
})
export class CreateEventPageModule {}
