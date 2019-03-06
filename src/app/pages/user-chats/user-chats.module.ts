import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserChatsPage } from './user-chats.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { AutosizeModule } from 'ngx-autosize';

const routes: Routes = [
  {
    path: '',
    component: UserChatsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    AutosizeModule,
  ],
  declarations: [UserChatsPage],
})
export class UserChatsPageModule {}
