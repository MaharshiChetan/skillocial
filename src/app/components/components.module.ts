import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginComponent } from './social-login/social-login.component';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import LazyLoadImageModule, { intersectionObserverPreset } from 'ng-lazyload-image';
import { RouterModule } from '@angular/router';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { MomentModule } from 'ngx-moment';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  declarations: [
    SocialLoginComponent,
    PopoverComponent,
    EditProfileComponent,
    UsersListComponent,
    ChatBubbleComponent,
  ],
  entryComponents: [
    PopoverComponent,
    EditProfileComponent,
    UsersListComponent,
    ChatBubbleComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
    RouterModule,
    MomentModule,
    AutosizeModule,
  ],
  exports: [
    SocialLoginComponent,
    PopoverComponent,
    EditProfileComponent,
    UsersListComponent,
    ChatBubbleComponent,
  ],
})
export class ComponentsModule {}
