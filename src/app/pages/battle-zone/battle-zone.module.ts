import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BattleZonePage } from './battle-zone.page';

const routes: Routes = [
  {
    path: '',
    component: BattleZonePage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [BattleZonePage]
})
export class BattleZonePageModule {}
