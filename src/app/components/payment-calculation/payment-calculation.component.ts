import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-payment-calculation',
  templateUrl: './payment-calculation.component.html',
  styleUrls: ['./payment-calculation.component.scss'],
})
export class PaymentCalculationComponent implements OnInit {
  event: Event;
  currentUserProfile: any;
  selectedCategories: any = [];
  totalFees: number = 0;
  internetHandlingFees: number;
  stateGST: number = 0;
  centralGST: number = 0;
  baseAmount: any;
  viewer: boolean;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.event = this.navParams.get('event');
    this.viewer = this.navParams.get('viewer');
    if (this.viewer) {
      this.viewerPayment();
    } else {
      this.participationPayment();
    }
    this.currentUserProfile = await this.userService.getCurrentUser();
  }

  viewerPayment() {
    this.totalFees = this.event.entryFees;
    this.calculatePayment();
  }

  participationPayment() {
    this.event.participationCategories.forEach((category: any, i: number) => {
      if (category.isChecked) {
        this.selectedCategories.push(category);
        this.totalFees += parseInt(category.fees);
        console.log(category);
      }
    });
    this.calculatePayment();
  }

  calculatePayment() {
    // calculate 8% profit if amount is > 600 else 10%
    this.internetHandlingFees =
      this.totalFees > 600
        ? parseFloat((this.totalFees * (8 / 100)).toFixed(2))
        : parseFloat((this.totalFees * (10 / 100)).toFixed(2));
    this.totalFees += this.internetHandlingFees;
    this.stateGST = parseFloat((this.internetHandlingFees * (9 / 100)).toFixed(2));
    this.centralGST = parseFloat((this.internetHandlingFees * (9 / 100)).toFixed(2));
    this.baseAmount = this.internetHandlingFees - (this.stateGST + this.centralGST);
  }

  async showTaxBreakup() {
    const alert = await this.alertCtrl.create({
      header: 'Tax Breakup',
      message: `<h6 text-left>Internet handling fees <ion-text float-right>&#x20b9; ${
        this.internetHandlingFees
      }</ion-text></h6>
      <p text-left class="text-gray">Base Amount<ion-text float-right>&#x20b9; ${
        this.baseAmount
      }</ion-text></p>
      <p text-left class="text-gray">State GST (SGST) @ 9%<ion-text float-right>&#x20b9; ${
        this.stateGST
      }</ion-text></p>
      <p text-left class="text-gray">Central GST (CGST) @ 9%<ion-text float-right>&#x20b9; ${
        this.centralGST
      }</ion-text></p>
      `,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
      ],
      cssClass: 'tax-breakup-alert',
    });

    await alert.present();
  }

  pay() {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: this.totalFees + '00',
      external: {
        wallets: ['paytm'],
      },
      name: 'foo',
      prefill: {
        email: 'ankushchaudhry794@gmail.com',
        contact: '9820800660',
        name: 'Ankush Chaudhry',
      },
      theme: {
        color: '#F37254',
      },
      modal: {
        ondismiss: function() {
          alert('dismissed');
        },
      },
    };

    var successCallback = function(payment_id: any) {
      alert('payment_id: ' + payment_id);
    };

    var cancelCallback = function(error: any) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

  async dismissModal() {
    const alert = await this.alertCtrl.create({
      header: 'Canceling your plan?',
      message: 'Are you sure you want to cancel the transaction?',
      buttons: [
        {
          text: 'No',
          role: 'destructive',
          handler: () => {
            console.log('Confirm Okay');
          },
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.modalCtrl.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }
}
