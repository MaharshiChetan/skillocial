import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user';
import { RegisterCredentials } from 'src/app/models/registerCredentials';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  formErrors = {
    fullName: '',
    username: '',
    email: '',
    password: ''
  };

  validationMessages = {
    fullName: {
      required: 'Name is required.'
    },
    username: {
      required: 'Username is required.',
      pattern: 'Username can only use letters, numbers and underscores.',
      maxlength: 'Username cannot be more than 25 characters long.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email'
    },
    password: {
      required: 'Password is required.',
      pattern: 'Password must include at least one letter and one number.',
      minlength: 'Password must be at least 6 characters long.',
      maxlength: 'Password cannot be more than 25 characters long.'
    }
  };
  constructor(
    public navCtrl: NavController,
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.registerForm = this.formBuilder.group({
      fullName: [null, Validators.compose([Validators.required])],
      username: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:.(?!.))){0,40}(?:[A-Za-z0-9_]))?)$'),
          Validators.maxLength(25)
        ])
      ],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25)
        ])
      ]
    });

    this.registerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.registerForm) {
      return;
    }
    const form = this.registerForm;
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

  async signUp() {
    const registerCredentials: RegisterCredentials = this.registerForm.value;
    let user: User = this.registerForm.value;
    await this.loadingService.show('Signing Up...');
    try {
      const userCredentials: firebase.auth.UserCredential = await this.authService.emailSignUp(registerCredentials);
      delete user['password'];
      user.uid = userCredentials.user.uid;
      user.loginType = 'email-password';
      user.profilePhoto = 'https://lakewangaryschool.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg';
      user.bio = "Hey! I'm using skillocial.";

      await this.authService.sendEmailVerification();
      await this.authService.updateUserProfile(user);
      await this.userService.addUser(user);
      this.resetForm();
      await this.loadingService.hide();
      await this.navCtrl.navigateRoot('login');
      this.showAlert();
    } catch (error) {
      console.log(error);
      await this.loadingService.hide();
      if (error.message) {
        await this.toastService.showToast(`${error.message}`);
      } else {
        await this.toastService.showToast('Something went wrong! Please try again');
      }
    }
  }

  resetForm(): void {
    this.registerForm.reset();
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Verification Sent!',
      message: 'Please verify your email before logging in.',
      buttons: [{ text: 'OK', role: 'destructive', handler: async (data: any) => { } }]
    });
    await alert.present();
  }
}
