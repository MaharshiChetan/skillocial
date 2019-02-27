import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private navCtrl: NavController, private userService: UserService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.userService
      .getCurrentUser()
      .then(user => {
        if (user) {
          return true;
        } else {
          console.log('access denied!');
          this.navCtrl.navigateRoot(['login']);
          return false;
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
