import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginComponent } from './social-login/social-login.component';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SocialLoginComponent, PopoverComponent, EditProfileComponent],
  entryComponents: [PopoverComponent, EditProfileComponent],
  imports: [CommonModule, IonicModule.forRoot(), ReactiveFormsModule],
  exports: [SocialLoginComponent, PopoverComponent, EditProfileComponent],
})
export class ComponentsModule {}
