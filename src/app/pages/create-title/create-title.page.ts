import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera/camera.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { TitleService } from 'src/app/services/title/title.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Title } from 'src/app/models/title';
import * as firebase from 'firebase';

@Component({
  selector: 'app-create-title',
  templateUrl: './create-title.page.html',
  styleUrls: ['./create-title.page.scss'],
})
export class CreateTitlePage implements OnInit, OnDestroy {
  defaultPicture =
    'https://banner2.kisspng.com/20180406/ype/kisspng-computer-icons-trophy-award-trophy-5ac75f9eef5be5.5335408415230155829804.jpg';
  otherCategory: string = 'Other';
  titleForm: FormGroup;
  title: Title;
  titleId: string;
  currentUserProfile: User;

  constructor(
    public cameraService: CameraService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private titlesService: TitleService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private afStore: AngularFirestore,
    private formBuilder: FormBuilder,
    private afStorage: AngularFireStorage,
    private userService: UserService
  ) {
    this.buildForm();
  }

  async ngOnInit() {
    this.currentUserProfile = await this.userService.getCurrentUser();
    this.titleId = this.route.snapshot.paramMap.get('id');
    console.log(this.titleId);
    this.buildForm();
    if (this.titleId) this.getTitleDetails();
  }

  ngOnDestroy() {
    this.cameraService.chosenPicture = null;
  }

  getTitleDetails() {
    const subscription = this.titlesService.getTitleById(this.titleId).subscribe((title: any) => {
      this.title = title;
      this.buildForm();
      subscription.unsubscribe();
    });
  }

  buildForm() {
    if (this.titleId) {
      this.titleForm = this.formBuilder.group({
        title: [this.title.title, Validators.compose([Validators.required])],
        description: [this.title.description, Validators.compose([Validators.required])],
        location: [this.title.location, Validators.compose([Validators.required])],
        winningPosition: [this.title.winningPosition, Validators.compose([Validators.required])],
        category: [this.title.category, Validators.compose([Validators.required])],
        type: [this.title.type, Validators.compose([Validators.required])],
        year: [this.title.year, Validators.compose([Validators.required])],
      });
    } else {
      this.titleForm = this.formBuilder.group({
        title: [null, Validators.compose([Validators.required])],
        description: [null, Validators.compose([Validators.required])],
        location: [null, Validators.compose([Validators.required])],
        winningPosition: [null, Validators.compose([Validators.required])],
        category: [null, Validators.compose([Validators.required])],
        type: [null, Validators.compose([Validators.required])],
        year: [null, Validators.compose([Validators.required])],
      });
    }
  }

  change(e: string) {
    if (e === 'Other') {
      this.showPrompt();
    }
  }

  async showPrompt() {
    const prompt = await this.alertCtrl.create({
      header: 'Category',
      message: 'Please enter the category in which you have won!',
      inputs: [{ name: 'category', placeholder: 'Category(other)' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Perfect',
          handler: data => {
            this.otherCategory = data.category;
          },
        },
      ],
    });
    prompt.present();
  }

  async addTitle() {
    await this.loadingService.show('Creating title...');
    let imageId = this.title ? this.title.imageId : this.afStore.createId();

    const imageStore = this.afStorage.storage
      .ref('/titleImages')
      .child(`${this.currentUserProfile.uid}/${imageId}`);
    if (this.cameraService.chosenPicture) {
      await imageStore.putString(this.cameraService.chosenPicture, 'data_url');
      const imageUrl = await imageStore.getDownloadURL();
      this.updateTitleDetails(imageUrl, imageId);
    } else {
      this.updateTitleDetails(this.defaultPicture);
    }
    if (this.titleId) this.updateTitle();
    else this.titlesService.addTitle(this.title);
    await this.loadingService.hide();
    this.titleForm.reset();
    await this.navCtrl.pop();
  }

  updateTitleDetails(imageUrl?: string, imageId?: string) {
    this.title = this.titleForm.value;
    if (!imageUrl && this.title) {
      imageUrl = this.title.imageUrl;
    }

    this.title.imageUrl = imageUrl || this.defaultPicture;
    if (this.titleId) {
      this.title.imageId = this.title.imageId || null;
    } else if (imageId) {
      this.title.imageId = imageId;
    }
    this.title.uid = this.currentUserProfile.uid;
    if (this.titleId) {
      this.title.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      this.title.createdAt =
        this.title.updatedAt || firebase.firestore.FieldValue.serverTimestamp();
    } else {
      this.title.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      this.title.updatedAt = this.title.createdAt;
    }
  }

  async updateTitle() {
    await this.titlesService.updateTitle(this.title, this.titleId);
  }
}
