import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';
import { ModalController } from '@ionic/angular';
import { ActiveUsersInEventService } from 'src/app/services/active-users-in-event.service/active-users-in-event.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-track-event',
  templateUrl: './track-event.page.html',
  styleUrls: ['./track-event.page.scss']
})
export class TrackEventPage implements OnInit {
  eventId: string;
  type: string = 'activeUsers';
  activeUsers: any = {};
  activeUsersCount: any;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private activeUsersInEventService: ActiveUsersInEventService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.getActiveUsersCount();
  }

  getActiveUsersCount(event?: any) {
    this.activeUsersInEventService.getActiveUsersCount(this.eventId).subscribe(activeUsersCount => {
      this.activeUsersCount = activeUsersCount;
      if (event) event.target.complete();
    });
  }

  async showActiveUsers(navTitle: string, type: string) {
    if (this.activeUsers && this.activeUsers[type]) {
      this.showModal(this.activeUsers[type], navTitle);
    } else {
      await this.loadingService.show();
      const subscription = this.activeUsersInEventService
        .getActiveUsers(this.eventId, type)
        .subscribe(async activeUsers => {
          this.activeUsers[type] = activeUsers;
          subscription.unsubscribe();
          this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
            [type]: activeUsers.length
          });
          this.showModal(activeUsers, navTitle);
          await this.loadingService.hide();
        });
    }
  }

  async showModal(activeUsers: any, navTitle: string) {
    const modal = await this.modalCtrl.create({
      component: UsersListComponent,
      componentProps: {
        usersUID: activeUsers,
        navTitle: navTitle,
        eventId: this.eventId
      },
      backdropDismiss: true,
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }
}
