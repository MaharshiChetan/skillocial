import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth-gaurd/auth-gaurd';
import { ConfirmationGuard } from './guards/confirmation.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  // {
  //   path: 'event-details/5uiXhmvuvVCoUL4RqqJL',
  //   loadChildren: './pages/event-details/event-details.module#EventDetailsPageModule',
  //   canActivate: [AuthGuard],
  // },
  // { path: '', redirectTo: '/event-details/5uiXhmvuvVCoUL4RqqJL', pathMatch: 'full' },
  {
    path: 'register',
    loadChildren: './pages/register/register.module#RegisterPageModule',
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
  },
  {
    path: 'upcoming-events',
    loadChildren: './pages/upcoming-events/upcoming-events.module#UpcomingEventsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'collections',
    loadChildren: './pages/collections/collections.module#CollectionsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'create-event',
    loadChildren: './pages/create-event/create-event.module#CreateEventPageModule',
    canActivate: [AuthGuard],
    canDeactivate: [ConfirmationGuard],
  },
  {
    path: 'edit-event/:id',
    loadChildren: './pages/create-event/create-event.module#CreateEventPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'create-post',
    loadChildren: './pages/create-post/create-post.module#CreatePostPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'chat-list',
    loadChildren: './pages/chat-list/chat-list.module#ChatListPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications',
    loadChildren: './pages/notifications/notifications.module#NotificationsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'event-details',
    loadChildren: './pages/event-details/event-details.module#EventDetailsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'event-details/:id',
    loadChildren: './pages/event-details/event-details.module#EventDetailsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'titles-list',
    loadChildren: './pages/titles-list/titles-list.module#TitlesListPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'title-details',
    loadChildren: './pages/title-details/title-details.module#TitleDetailsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'user-posts',
    loadChildren: './pages/user-posts/user-posts.module#UserPostsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'voting-categories',
    loadChildren: './pages/voting-categories/voting-categories.module#VotingCategoriesPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'voting',
    loadChildren: './pages/voting/voting.module#VotingPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'create-title',
    loadChildren: './pages/create-title/create-title.module#CreateTitlePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'user-events',
    loadChildren: './pages/user-events/user-events.module#UserEventsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'user-chats',
    loadChildren: './pages/user-chats/user-chats.module#UserChatsPageModule',
    canActivate: [AuthGuard],
  },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'users-list', loadChildren: './users-list/users-list.module#UsersListPageModule' },
  { path: 'my-events', loadChildren: './my-events/my-events.module#MyEventsPageModule' },
  { path: 'my-requests', loadChildren: './my-requests/my-requests.module#MyRequestsPageModule' },
  { path: 'chat-settings', loadChildren: './chat-settings/chat-settings.module#ChatSettingsPageModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
