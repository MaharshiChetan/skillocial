import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { ComponentsModule } from 'src/app/components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
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
    ComponentsModule,
    FontAwesomeModule
  ],
  declarations: [HomePage],
})
export class HomePageModule { }
