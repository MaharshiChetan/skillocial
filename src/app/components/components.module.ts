import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginComponent } from './social-login/social-login.component';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { RouterModule } from '@angular/router';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { MomentModule } from 'ngx-moment';
import { AutosizeModule } from 'ngx-autosize';
import { ThumbnailPostsComponent } from './thumbnail-posts/thumbnail-posts.component';
import { PostsComponent } from './posts/posts.component';
import { CommentsComponent } from './comments/comments.component';
import { ParticipationCategoriesComponent } from './participation-categories/participation-categories.component';
import { PaymentCalculationComponent } from './payment-calculation/payment-calculation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    SocialLoginComponent,
    PopoverComponent,
    EditProfileComponent,
    UsersListComponent,
    ChatBubbleComponent,
    ThumbnailPostsComponent,
    PostsComponent,
    CommentsComponent,
    ParticipationCategoriesComponent,
    PaymentCalculationComponent,
  ],
  entryComponents: [
    PopoverComponent,
    EditProfileComponent,
    UsersListComponent,
    ChatBubbleComponent,
    ThumbnailPostsComponent,
    PostsComponent,
    CommentsComponent,
    ParticipationCategoriesComponent,
    PaymentCalculationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
    RouterModule,
    MomentModule,
    AutosizeModule,
    FontAwesomeModule
  ],
  exports: [
    SocialLoginComponent,
    PopoverComponent,
    EditProfileComponent,
    UsersListComponent,
    ChatBubbleComponent,
    ThumbnailPostsComponent,
    PostsComponent,
    CommentsComponent,
    ParticipationCategoriesComponent,
    PaymentCalculationComponent,
  ],
})
export class ComponentsModule { }
