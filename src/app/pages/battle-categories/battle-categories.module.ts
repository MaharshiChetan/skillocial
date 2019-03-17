import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BattleCategoriesPage } from './battle-categories.page';

const routes: Routes = [
  {
    path: '',
    component: BattleCategoriesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BattleCategoriesPage]
})
export class BattleCategoriesPageModule {}
