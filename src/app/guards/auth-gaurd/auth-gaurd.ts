import { Injectable } from '@angular/core';
import { CanActivate, } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private navCtrl: NavController, private userService: UserService) { }
  canActivate(): Promise<boolean> | boolean {
    this.userService
      .getCurrentUser()
      .then(user => {
        if (!user) {
          console.log('access denied!');
          this.navCtrl.navigateRoot(['login']);
          return false;
        } else {
          return true;
        }
      })
      .catch(error => {
        console.log(error);
        this.navCtrl.navigateRoot(['login']);
        return false;
      });

    return true;
  }
}
