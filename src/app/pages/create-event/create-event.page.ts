import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event } from 'src/app/models/event';
import { Platform, ActionSheetController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/services/event/event.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { ConfirmationGuard } from 'src/app/guards/confirmation.guard';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit, OnDestroy {
  eventForm: FormGroup;
  eventDetails: Event;
  chosenPicture: any;
  eventId: string;
  eventDateAndTime = {
    startTime: '10:00',
    endTime: '19:00',
    startDate: this.currentDate(),
    endDate: this.currentDate(),
    min: new Date().getFullYear(),
    max: new Date().getFullYear() + 1,
  };
  imageStore: firebase.storage.Reference;
  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private cameraService: CameraService,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private toastService: ToastService,
    private eventService: EventsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore,
    private authService: AuthService,
    private confirmationGuard: ConfirmationGuard
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log(this.eventId);
    this.buildForm();
    if (this.eventId) this.getEventDetails();
    console.log(this.eventDateAndTime);
  }

  ngOnDestroy() {
    this.confirmationGuard.showAlertMessage = true;
  }

  currentDate() {
    const splitDate = new Date().toLocaleDateString().split('/');
    splitDate[1] = splitDate[1].length == 1 ? '0' + splitDate[1] : splitDate[1];
    splitDate[0] = splitDate[0].length == 1 ? '0' + splitDate[0] : splitDate[0];
    return `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`;
  }

  getEventDetails() {
    const subscription = this.eventService
      .getEventDetails(this.eventId)
      .subscribe((eventDetails: any) => {
        this.eventDetails = eventDetails;
        this.buildForm();
        subscription.unsubscribe();
      });
  }

  buildForm() {
    if (this.eventDetails) {
      this.eventForm = this.formBuilder.group({
        name: [this.eventDetails.name, Validators.compose([Validators.required])],
        description: [this.eventDetails.description, Validators.compose([Validators.required])],
        startDate: [this.eventDetails.startDate, Validators.compose([Validators.required])],
        endDate: [this.eventDetails.endDate, Validators.compose([Validators.required])],
        startTime: [this.eventDetails.startTime, Validators.compose([Validators.required])],
        endTime: [this.eventDetails.endTime, Validators.compose([Validators.required])],
        entryFees: [this.eventDetails.entryFees, Validators.compose([Validators.required])],
        location: [this.eventDetails.location, Validators.compose([Validators.required])],
        state: [this.eventDetails.state, Validators.compose([Validators.required])],
        city: [this.eventDetails.city, Validators.compose([Validators.required])],
      });
    } else {
      this.eventForm = this.formBuilder.group({
        name: [null, Validators.compose([Validators.required])],
        description: [null, Validators.compose([Validators.required])],
        entryFees: [null, Validators.compose([Validators.required])],
        location: [null, Validators.compose([Validators.required])],
        state: [null, Validators.compose([Validators.required])],
        city: [null, Validators.compose([Validators.required])],
        startDate: [this.eventDateAndTime.startDate, Validators.compose([Validators.required])],
        endDate: [this.eventDateAndTime.endDate, Validators.compose([Validators.required])],
        startTime: [this.eventDateAndTime.startTime, Validators.compose([Validators.required])],
        endTime: [this.eventDateAndTime.endTime, Validators.compose([Validators.required])],
      });
    }
  }

  async updateEvent() {
    if (!(this.chosenPicture || this.eventId)) {
      this.toastService.showToast('Please upload event image, Its mandatory!', 'top');
      return;
    }
    this.loadingService.show('Updating event...');
    const uid = this.authService.currentUserId;
    let imageId = this.eventId ? this.eventId : this.afStore.createId();
    let event = this.eventForm.value;
    event.startDateTime =
      this.eventForm.get('startDate').value + ' ' + this.eventForm.get('startTime').value;
    event.endDateTime =
      this.eventForm.get('endDate').value + ' ' + this.eventForm.get('endTime').value;
    event.uid = uid;
    event.imageId = imageId;
    this.imageStore = this.afStorage.storage.ref('eventImages').child(`${uid}/${imageId}`);

    if (this.eventId) {
      try {
        if (this.chosenPicture) {
          await this.imageStore.putString(this.chosenPicture, 'data_url');
          const imageUrl = await this.imageStore.getDownloadURL();
          event.imageUrl = imageUrl;
        }
        event.imageUrl = this.eventDetails.imageUrl;
        await this.eventService.updateEvent(event, this.eventId);
        this.loadingService.hide();
        this.toastService.showToast('Successfully updated event!', 'top');
        this.confirmationGuard.showAlertMessage = false;
        this.navCtrl.navigateBack(['/tabs/upcoming-events']);
      } catch (error) {
        this.loadingService.hide();
        this.toastService.showToast('Failed to update event!', 'top');
        alert(error);
      }
    } else {
      try {
        await this.imageStore.putString(this.chosenPicture, 'data_url');
        const imageUrl = await this.imageStore.getDownloadURL();
        event.imageUrl = imageUrl;
        await this.eventService.createEvent(event, imageId);
        await this.loadingService.hide();
        await this.toastService.showToast('Successfully created event!', 'top');
        this.confirmationGuard.showAlertMessage = false;
        this.navCtrl.navigateBack(['/tabs/upcoming-events']);
      } catch (error) {
        this.loadingService.hide();
        this.toastService.showToast('Failed to update event!', 'top');
        alert(error);
      }
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
    this.loadingService.show();
    try {
      const picture = await this.cameraService.getPictureFromCamera(false);
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
    this.loadingService.show();
    try {
      const picture = await this.cameraService.getPictureFromPhotoLibrary(false);
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
}
