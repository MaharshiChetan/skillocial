import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { PaymentCalculationComponent } from '../payment-calculation/payment-calculation.component';

@Component({
  selector: 'app-participation-categories',
  templateUrl: './participation-categories.component.html',
  styleUrls: ['./participation-categories.component.scss'],
})
export class ParticipationCategoriesComponent implements OnInit {
  event: any;
  currentUserProfile: User;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.event = this.navParams.get('event');
    this.event.participationCategories.forEach((category: any, i: number) => {
      this.event.participationCategories[i].isChecked = i === 0 ? true : false;
    });
    this.currentUserProfile = await this.userService.getCurrentUser();
  }

  async proceed() {
    const modal = await this.modalCtrl.create({
      component: PaymentCalculationComponent,
      componentProps: { event: this.event },
      backdropDismiss: false,
      animated: false,
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
