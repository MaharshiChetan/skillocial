import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { PaymentCalculationComponent } from '../payment-calculation/payment-calculation.component';
import { ActiveUsersInEventService } from 'src/app/services/active-users-in-event.service/active-users-in-event.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-participation-categories',
  templateUrl: './participation-categories.component.html',
  styleUrls: ['./participation-categories.component.scss']
})
export class ParticipationCategoriesComponent implements OnInit {
  event: any;
  currentUserProfile: User;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private userService: UserService,
    private alertCtrl: AlertController,
    private activeUsersInEventService: ActiveUsersInEventService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    this.event = this.navParams.get('event');
    this.event.participationCategories.forEach((category: any, i: number) => {
      this.event.participationCategories[i].isChecked = i === 0 ? true : false;
    });
    this.currentUserProfile = await this.userService.getCurrentUser();
  }

  async proceed() {
    const alert = await this.alertCtrl.create({
      header: 'Payment Options',
      message: 'Do you wants to pay now or send request for on spot entry?',
      buttons: [
        {
          text: 'Request On Spot Entry',
          handler: async () => {
            this.sendOnSpotRequest();
          }
        },
        {
          text: 'Pay Now',
          handler: () => {
            this.showPayment();
          }
        }
      ]
    });
    await alert.present();
  }

  async sendOnSpotRequest() {}

  async showPayment() {
    const modal = await this.modalCtrl.create({
      component: PaymentCalculationComponent,
      componentProps: { event: this.event },
      backdropDismiss: true,
      animated: false
    });
    modal.present();
    modal.onWillDismiss().then(async data => {
      console.log(data);
    });
  }

  async dismissModal() {
    await this.modalCtrl.dismiss();
  }
}
