import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoginCredentials } from 'src/app/models/loginCredentials';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  formErrors = {
    email: '',
    password: '',
  };

  validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email',
    },
    password: {
      required: 'Password is required.',
      pattern: 'Password must be include at one letter and one number.',
      minlength: 'Password must be at least 6 characters long.',
      maxlength: 'Password cannot be more than 25 characters long.',
    },
  };

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    this.buildForm();
    const user = await this.userService.getCurrentUser();
    if (user) {
      await this.navCtrl.navigateRoot(['tabs']);
    }
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25),
        ]),
      ],
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any): void {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  async forgotPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: "Enter your email and we'll send you a link to get back into your account.",
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: this.loginForm.get('email').valid ? this.loginForm.get('email').value : null,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'destructive',
          cssClass: 'secondary',
        },
        {
          text: 'Confirm',
          handler: async (data: any) => {
            this.sendResetPasswordLink(data.email);
          },
        },
      ],
    });
    await alert.present();
  }

  async sendResetPasswordLink(email: string): Promise<void> {
    await this.loadingService.show();
    try {
      await this.authService.resetPassword(email);
      await this.loadingService.hide();
      await this.toastService.showToast('Reset password link was sent successfully.');
    } catch (error) {
      console.log(error);
      await this.loadingService.hide();
      await this.toastService.showToast(error.message);
    }
  }

  async login() {
    const loginCredentials: LoginCredentials = this.loginForm.value;
    await this.loadingService.show('Signing In...');
    try {
      const userCredentials: firebase.auth.UserCredential = await this.authService.emailLogin(
        loginCredentials
      );
      if (userCredentials.user.emailVerified === true) {
        const userProfileSubscription = this.userService
          .getUserByUID(userCredentials.user.uid)
          .subscribe(async (user: any) => {
            await this.userService.storeUserData(user);
            this.resetForm();
            await this.loadingService.hide();
            await this.navCtrl.navigateRoot('/tabs');
            userProfileSubscription.unsubscribe();
          });
      } else {
        await this.loadingService.hide();
        await this.toastService.showToast('Please verify your email before logging in.', 'top');
      }
    } catch (error) {
      console.log(error);
      await this.loadingService.hide();
      await this.toastService.showToast(`${error.message}`);
    }
  }

  resetForm(): void {
    this.loginForm.reset();
  }
}
