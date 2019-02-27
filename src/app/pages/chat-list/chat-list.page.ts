import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private userService: UserService
  ) {}

  ngOnInit() {}

  async onLogout() {
    const user: any = this.userService.getCurrentUser();
    if (user) {
      if (user.loginType === 'google') {
        try {
          await this.authService.googleLogout();
          this.logout();
        } catch (error) {
          alert('logout:' + error);
          this.logout();
        }
      } else if (user.loginType === 'facebook') {
        try {
          await this.authService.facebookLogout();
          this.logout();
        } catch (error) {
          alert('logout:' + error);
          this.logout();
        }
      } else if (user.loginType === 'twitter') {
        this.logout();
      } else {
        this.logout();
      }
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      await this.userService.removeCurrentUser();
      this.navCtrl.navigateRoot('login');
    } catch (error) {
      console.log(error);
    }
  }

  pay() {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: '100',
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

    var successCallback = function(payment_id) {
      alert('payment_id: ' + payment_id);
    };

    var cancelCallback = function(error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
}
