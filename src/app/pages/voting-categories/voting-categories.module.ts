import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VotingCategoriesPage } from './voting-categories.page';

const routes: Routes = [
  {
    path: '',
    component: VotingCategoriesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VotingCategoriesPage]
})
export class VotingCategoriesPageModule {}
