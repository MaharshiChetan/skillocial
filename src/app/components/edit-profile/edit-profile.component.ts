import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, Platform, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  chosenPicture: any;
  userProfile: any;
  userProfileForm: FormGroup;
  currentUserProfile: any;
  formErrors = {
    fullName: '',
    username: '',
    bio: '',
  };

  validationMessages = {
    fullName: {
      required: 'Name is required.',
    },
    username: {
      required: 'Username is required.',
      pattern: 'Username can only use letters, numbers and underscores.',
      maxlength: 'Username cannot be more than 25 characters long.',
    },
    bio: {
      maxlength: 'Bio cannot be more than 120 characters long.',
    },
  };
  updatedProfile: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private loadingService: LoadingService,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private afStorage: AngularFireStorage,
    private cameraService: CameraService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    console.log(this.navParams.get('userProfile'));
    this.userProfile = this.navParams.get('userProfile');
    this.buildForm();
    if (!this.userProfile) {
      this.getCurrentUserProfile();
    }
  }

  buildForm() {
    this.userProfileForm = this.formBuilder.group({
      fullName: [this.userProfile.fullName, Validators.compose([Validators.required])],
      username: [
        this.userProfile.username,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:.(?!.))){0,40}(?:[A-Za-z0-9_]))?)$'
          ),
          Validators.maxLength(25),
        ]),
      ],
      bio: [this.userProfile.bio],
    });
    this.userProfileForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userProfileForm) {
      return;
    }
    const form = this.userProfileForm;
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

  async submitForm() {
    await this.loadingService.show('Updating profile...');
    const userProfile = this.userProfileForm.value;

    if (this.userProfile.username !== userProfile.username) {
      const subscription = this.userService
        .checkUsername(userProfile.username)
        .subscribe(async (user: User[]) => {
          if (user.length > 0 && user[0].uid !== this.userProfile.uid) {
            await this.loadingService.hide();
            subscription.unsubscribe();
            this.toastService.showToast(`Username ${userProfile.username} is already taken!`);
          } else {
            subscription.unsubscribe();
            this.updateUserProfile(userProfile);
          }
        });
    } else {
      this.updateUserProfile(userProfile);
    }
  }

  async getCurrentUserProfile() {
    this.currentUserProfile = await this.userService.getCurrentUser();
    const subscription = this.userService
      .getUserByUID(this.currentUserProfile.uid)
      .subscribe((user: User) => {
        this.userProfile = user;
        console.log(user);

        subscription.unsubscribe();
      });
  }

  async updateUserProfile(userProfile: any) {
    try {
      if (this.chosenPicture) {
        const imageStore = this.afStorage.storage
          .ref('userProfilePhoto')
          .child(this.userProfile.uid);
        await imageStore.putString(this.chosenPicture, 'data_url');
        const imageUrl = await imageStore.getDownloadURL();
        userProfile.profilePhoto = imageUrl;
      }
      await this.userService.updateUser(userProfile, this.userProfile.uid);
      await this.loadingService.hide();
      this.updatedProfile = true;
      this.toastService.showToast('Successfully updated your profile!', 'top');
      this.dismissModal();
    } catch (error) {
      await this.loadingService.hide();
      this.toastService.showToast('Failed to updated your profile!', 'top');
    }
  }

  async changePicture() {
    const actionsheetCtrl = await this.actionsheetCtrl.create({
      header: 'Upload picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return await actionsheetCtrl.present();
  }

  async takePicture() {
    await this.loadingService.show();
    try {
      const picture = await this.cameraService.getPictureFromCamera(true);
      if (picture) {
        const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
        this.cameraService.generateFromImage(picture, quality, (data: any) => {
          this.chosenPicture =
            parseFloat(this.cameraService.getImageSize(picture)) >
            parseFloat(this.cameraService.getImageSize(data))
              ? data
              : picture;
        });
      } else {
        await this.loadingService.hide();
      }
      await this.loadingService.hide();
    } catch (error) {
      await this.loadingService.hide();
      alert(error);
    }
  }

  async getPicture() {
    await this.loadingService.show();
    try {
      const picture = await this.cameraService.getPictureFromPhotoLibrary(true);
      if (picture) {
        const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
        this.cameraService.generateFromImage(picture, quality, (data: any) => {
          this.chosenPicture =
            parseFloat(this.cameraService.getImageSize(picture)) >
            parseFloat(this.cameraService.getImageSize(data))
              ? data
              : picture;
        });
      } else {
        await this.loadingService.hide();
      }
      await this.loadingService.hide();
    } catch (error) {
      await this.loadingService.hide();
      alert(error);
    }
  }

  async dismissModal() {
    await this.modalCtrl.dismiss(this.updatedProfile);
  }
}
