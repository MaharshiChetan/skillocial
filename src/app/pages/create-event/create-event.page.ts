import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Event } from 'src/app/models/event';
import { NavController, AlertController } from '@ionic/angular';
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
  eventId: string;
  eventDateAndTime = {
    startTime: '10:00',
    endTime: '20:00',
    startDate: this.currentDate(),
    endDate: this.currentDate(),
    min: new Date().getFullYear(),
    max: new Date().getFullYear() + 1,
  };
  imageStore: firebase.storage.Reference;
  participationCategories: any = [];
  constructor(
    public cameraService: CameraService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private eventService: EventsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore,
    private authService: AuthService,
    private confirmationGuard: ConfirmationGuard,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.buildForm();
    if (this.eventId) this.getEventDetails();
  }

  ngOnDestroy() {
    this.confirmationGuard.showAlertMessage = true;
    this.cameraService.chosenPicture = null;
  }

  currentDate() {
    const splitDate = new Date().toLocaleDateString().split('/');
    splitDate[1] = splitDate[1].length == 1 ? '0' + splitDate[1] : splitDate[1];
    splitDate[0] = splitDate[0].length == 1 ? '0' + splitDate[0] : splitDate[0];
    return `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`;
  }

  getEventDetails() {
    this.loadingService.show();
    const subscription = this.eventService
      .getEventById(this.eventId)
      .subscribe((eventDetails: any) => {
        this.eventDetails = eventDetails;
        if (eventDetails.participationCategories) {
          this.participationCategories = eventDetails.participationCategories;
        }
        this.buildForm();
        subscription.unsubscribe();
        this.loadingService.hide();
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
        startDate: [this.eventDateAndTime.startDate, Validators.compose([Validators.required])],
        endDate: [this.eventDateAndTime.endDate, Validators.compose([Validators.required])],
        startTime: [this.eventDateAndTime.startTime, Validators.compose([Validators.required])],
        endTime: [this.eventDateAndTime.endTime, Validators.compose([Validators.required])],
        entryFees: [null, Validators.compose([Validators.required])],
        location: [null, Validators.compose([Validators.required])],
        state: [null, Validators.compose([Validators.required])],
        city: [null, Validators.compose([Validators.required])],
      });
    }
  }

  async updateEvent() {
    if (!(this.cameraService.chosenPicture || this.eventId)) {
      await this.toastService.showToast('Please upload event image, Its mandatory!', 'top');
      return;
    }
    await this.loadingService.show('Updating event...');
    const uid = this.authService.currentUserId;
    let imageId = this.eventId ? this.eventId : this.afStore.createId();
    let event = this.eventForm.value;
    event.startDateTime =
      this.eventForm.get('startDate').value + ' ' + this.eventForm.get('startTime').value;
    event.endDateTime =
      this.eventForm.get('endDate').value + ' ' + this.eventForm.get('endTime').value;
    event.uid = uid;
    event.imageId = imageId;
    event.participationCategories = this.participationCategories;
    event.timeStamp = firebase.firestore.FieldValue.serverTimestamp();

    this.imageStore = this.afStorage.storage.ref('eventImages').child(`${uid}/${imageId}`);

    try {
      if (this.cameraService.chosenPicture) {
        await this.imageStore.putString(this.cameraService.chosenPicture, 'data_url');
        const imageUrl = await this.imageStore.getDownloadURL();
        event.imageUrl = imageUrl;
      } else {
        event.imageUrl = this.eventDetails.imageUrl;
      }
      if (this.eventId) {
        await this.eventService.updateEvent(event, this.eventId);
      } else {
        await this.eventService.createEvent(event);
      }
      await this.loadingService.hide();
      this.toastService.showToast('Successfully updated event!', 'top');
      this.confirmationGuard.showAlertMessage = false;
      this.navCtrl.navigateBack(['/tabs/upcoming-events']);
    } catch (error) {
      await this.loadingService.hide();
      this.toastService.showToast('Failed to update event!', 'top');
      alert(error);
    }
  }

  async addParticipationCategories(category?: any, index?: number) {
    const prompt = await this.alertCtrl.create({
      header: category ? 'Edit Category' : 'Add Category',
      message: 'Enter the name and price of category.',
      inputs: [
        {
          name: 'category',
          placeholder: 'Category (Eg: 1 vs 1 Breaking)',
          value: category ? category.name : '',
        },
        {
          name: 'fees',
          placeholder: 'Participation fees (Eg: 200)',
          value: category ? category.fees : '',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'destructive' },
        {
          text: category ? 'Update' : 'Add',
          handler: data => {
            if (category) {
              this.participationCategories[index].name = data.category;
              this.participationCategories[index].fees = parseInt(data.fees);
            } else {
              console.log(this.participationCategories);

              this.participationCategories.push({
                name: data.category,
                fees: parseInt(data.fees),
              });
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  removeParticipationCategory(index: number) {
    this.participationCategories.splice(index, 1);
  }
}
