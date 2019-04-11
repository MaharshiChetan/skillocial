import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  currentUserProfile: any;
  userProfile: User;
  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.getCurrentUserProfile();
  }

  async getCurrentUserProfile(refresher?: any) {
    this.currentUserProfile = await this.userService.getCurrentUser();
    this.userProfile = this.currentUserProfile;
    if (this.currentUserProfile) {
      const subscription = this.userService
        .getUserByUID(this.currentUserProfile.uid)
        .subscribe((user: User) => {
          subscription.unsubscribe();
          this.userProfile = user;

          if (refresher) refresher.target.complete();
        });
    }
  }
}
