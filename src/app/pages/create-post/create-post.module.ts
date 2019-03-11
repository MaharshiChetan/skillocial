import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatePostPage } from './create-post.page';
import { AutosizeModule } from 'ngx-autosize';

const routes: Routes = [
  {
    path: '',
    component: CreatePostPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AutosizeModule,
    ReactiveFormsModule,
  ],
  declarations: [CreatePostPage],
})
export class CreatePostPageModule {}
