import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateTitlePage } from './create-title.page';
import { AutosizeModule } from 'ngx-autosize';

const routes: Routes = [
  {
    path: '',
    component: CreateTitlePage,
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
  declarations: [CreateTitlePage],
})
export class CreateTitlePageModule {}
