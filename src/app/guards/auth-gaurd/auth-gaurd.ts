import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private navCtrl: NavController, private userService: UserService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
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
