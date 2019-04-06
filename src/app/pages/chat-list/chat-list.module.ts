import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatListPage } from './chat-list.page';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

const routes: Routes = [
  {
    path: '',
    component: ChatListPage,
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
  ],
  declarations: [ChatListPage],
})
export class ChatListPageModule { }
