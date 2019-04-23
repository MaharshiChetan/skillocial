import { Component, OnInit, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event';
import { IonContent, ModalController, NavController, ActionSheetController, IonFab } from '@ionic/angular';
import { EventsService } from 'src/app/services/event/event.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ActiveUsersInEventService } from 'src/app/services/active-users-in-event.service/active-users-in-event.service';
import { User } from 'src/app/models/user';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ParticipationCategoriesComponent } from 'src/app/components/participation-categories/participation-categories.component';
import { PaymentCalculationComponent } from 'src/app/components/payment-calculation/payment-calculation.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss']
})
export class EventDetailsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  event: Event;
  eventId: string;
  isGoing: any;
  isInterested: any;
  interestedUsersCount: any;
  interestedUsers: any;
  goingUsersCount: any;
  goingUsers: any;
  user: User;
  fileTransfer: FileTransferObject;

  constructor(
    private eventService: EventsService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private userService: UserService,
    private activeUsersInEventService: ActiveUsersInEventService,
    private modalCtrl: ModalController,
    public photoViewer: PhotoViewer,
    private socialSharing: SocialSharing,
    private transfer: FileTransfer,
    private file: File
  ) {
    this.fileTransfer = this.transfer.create();
  }

  async ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.user = await this.userService.getCurrentUser();
    this.getEvent();
    this.isUserInterested();
    this.isUserGoing();
    this.getActiveUsersCount();
  }

  getEvent(refresher?: any) {
    const subscription = this.eventService.getEventById(this.eventId).subscribe((event: Event) => {
      subscription.unsubscribe();
      this.event = event;
      this.event.id = this.eventId;
      this.eventService.event = event;
      if (refresher) refresher.target.complete();
    });
  }

  async bookTicket() {
    const actionSheetCtrl = await this.actionSheetCtrl.create({
      header: 'Who are you?',
      buttons: [
        {
          text: 'Viewer',
          icon: 'eye',
          handler: () => {
            this.showPaymentDetails();
          }
        },
        {
          text: 'Participant',
          icon: 'people',
          handler: () => {
            this.selectParticipantCategory();
          }
        },
        { text: 'Cancel', icon: 'close', role: 'destructive' }
      ],
      mode: 'md'
    });
    return await actionSheetCtrl.present();
  }

  async showPaymentDetails() {
    const modal = await this.modalCtrl.create({
      component: PaymentCalculationComponent,
      componentProps: { event: this.event, viewer: true },
      backdropDismiss: false,
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(async data => {
      console.log(data);
    });
  }

  async selectParticipantCategory() {
    const modal = await this.modalCtrl.create({
      component: ParticipationCategoriesComponent,
      componentProps: { event: this.event },
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }

  getActiveUsersCount() {
    const subscription = this.activeUsersInEventService.getActiveUsersCount(this.eventId).subscribe((data: any) => {
      subscription.unsubscribe();
      this.interestedUsersCount = data ? data.interested : 0;
      this.goingUsersCount = data ? data.going : 0;
    });
  }

  getInterestedUsersInEvent() {
    const subscription = this.activeUsersInEventService.getActiveUsers(this.eventId, 'interested').subscribe(users => {
      subscription.unsubscribe();
      this.interestedUsers = users;
      this.interestedUsersCount = users.length;
      this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
        interested: users.length
      });
    });
  }

  getGoingUsersInEvent() {
    const subscription = this.activeUsersInEventService.getActiveUsers(this.eventId, 'going').subscribe(users => {
      subscription.unsubscribe();
      this.goingUsers = users;
      this.goingUsersCount = users.length;
      this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
        going: users.length
      });
    });
  }

  isUserInterested() {
    this.activeUsersInEventService.isActiveUser(this.eventId, this.user.uid, 'interested').subscribe((data: any) => {
      this.isInterested = data ? true : false;
    });
  }

  isUserGoing() {
    this.activeUsersInEventService.isActiveUser(this.eventId, this.user.uid, 'going').subscribe((data: any) => {
      this.isGoing = data ? true : false;
    });
  }

  async addInterestedOrGoing(type: string) {
    try {
      if (type === 'going') ++this.goingUsersCount;
      else ++this.interestedUsersCount;
      await this.activeUsersInEventService.addActiveUser(this.eventId, this.user.uid, type);
      if (type === 'going') this.getGoingUsersInEvent();
      else this.getInterestedUsersInEvent();
    } catch (e) {
      if (type === 'going') --this.goingUsersCount;
      else --this.interestedUsersCount;
      alert(e);
    }
  }

  async removeInterestedOrGoing(type: string) {
    try {
      if (type === 'going') --this.goingUsersCount;
      else --this.interestedUsersCount;
      await this.activeUsersInEventService.removeActiveUser(this.eventId, this.user.uid, type);
      if (type === 'going') this.getGoingUsersInEvent();
      else this.getInterestedUsersInEvent();
    } catch (e) {
      if (type === 'going') ++this.goingUsersCount;
      else ++this.interestedUsersCount;
      alert(e);
    }
  }

  async showInterestedUsers() {
    if (this.interestedUsers) {
      this.showModal('interestedUsers');
    } else {
      await this.loadingService.show();
      const subscription = this.activeUsersInEventService
        .getActiveUsers(this.eventId, 'interested')
        .subscribe(async users => {
          subscription.unsubscribe();
          this.interestedUsers = users;
          this.interestedUsersCount = users.length;
          this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
            interested: users.length
          });
          this.showModal('interestedUsers');
          await this.loadingService.hide();
        });
    }
  }

  async showGoingUsers() {
    if (this.goingUsers) {
      this.showModal('goingUsers');
    } else {
      await this.loadingService.show();
      const subscription = this.activeUsersInEventService
        .getActiveUsers(this.eventId, 'going')
        .subscribe(async users => {
          subscription.unsubscribe();
          this.goingUsers = users;
          this.goingUsersCount = users.length;
          this.activeUsersInEventService.updateActiveUsersCount(this.eventId, {
            going: users.length
          });
          this.showModal('goingUsers');
          await this.loadingService.hide();
        });
    }
  }

  async showModal(type: string) {
    const modal = await this.modalCtrl.create({
      component: UsersListComponent,
      componentProps: {
        usersUID: type === 'interestedUsers' ? this.interestedUsers : this.goingUsers,
        navTitle: type === 'interestedUsers' ? 'Interested' : 'Going'
      },
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
  }

  async popBack() {
    await this.navCtrl.navigateBack(['tabs/upcoming-events']);
  }

  async shareOnWhatsApp() {
    await this.loadingService.show();
    this.fileTransfer
      .download(this.event.imageUrl, this.file.dataDirectory + this.event.name + '.jpeg')
      .then(async image => {
        await this.loadingService.hide();
        this.socialSharing
          .shareViaWhatsApp(
            `*Event Name*:- ${this.event.name}\n*Event Description*:- ${this.event.description}\n`,
            image.toURL()
          )
          .then(async data => {
            await this.loadingService.hide();
          })
          .catch(async error => {
            await this.loadingService.hide();
          });
      })
      .catch(async e => {
        await this.loadingService.hide();
      });
  }

  async shareOnInstagram() {
    await this.loadingService.show();
    this.fileTransfer
      .download(this.event.imageUrl, this.file.dataDirectory + this.event.name + '.jpeg')
      .then(async image => {
        await this.loadingService.hide();
        this.socialSharing
          .shareViaInstagram(
            `*Event Name:-* ${this.event.name}\n*Event Description:-* ${this.event.description}`,
            image.toURL()
          )
          .then(async data => {
            await this.loadingService.hide();
          })
          .catch(async error => {
            await this.loadingService.hide();
            alert(error);
          });
      })
      .catch(async e => {
        await this.loadingService.hide();
      });
  }

  shareOnFacebook() {}
}
