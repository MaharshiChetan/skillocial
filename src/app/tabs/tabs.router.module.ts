import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'upcoming-events',
        children: [
          {
            path: '',
            loadChildren:
              '../pages/upcoming-events/upcoming-events.module#UpcomingEventsPageModule',
          },
        ],
      },
      {
        path: 'home',
        children: [{ path: '', loadChildren: '../pages/home/home.module#HomePageModule' }],
      },
      {
        path: 'chat-list',
        children: [
          { path: '', loadChildren: '../pages/chat-list/chat-list.module#ChatListPageModule' },
        ],
      },
      { path: '', redirectTo: '/tabs/home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/tabs/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
