import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, Platform, ActionSheetController, NavController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-user-chats',
  templateUrl: './user-chats.page.html',
  styleUrls: ['./user-chats.page.scss'],
})
export class UserChatsPage implements OnInit {
  uid: string;
  otherUserProfile: User;
  currentUserProfile: User;
  @ViewChild(IonContent) content: IonContent;

  inputElement;
  millis = 200;
  scrollTimeout = this.millis + 50;
  textareaHeight;
  scrollContentElement: any;
  footerElement: any;
  initialTextAreaHeight;
  user;
  keyboardHideSub;
  keybaordShowSub;

  messages: any;
  chosenPicture: any;
  chatSubscription: any;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private navCtrl: NavController,
    private chatService: ChatService,
    private actionSheetCtrl: ActionSheetController,
    private cameraService: CameraService,
    private loadingService: LoadingService,
    private keyboard: Keyboard,
    private afStorage: AngularFireStorage,
    private platform: Platform,
    private renderer: Renderer,
    private db: AngularFireDatabase
  ) {}

  async ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.currentUserProfile = await this.userService.getCurrentUser();
    this.getUserProfile();
    this.getCurrentUserProfile();
    //
    if (this.platform.is('ios')) {
      this.addKeyboardListeners();
    }

    this.scrollContentElement = this.content.getScrollElement();
    this.footerElement = document
      .getElementsByTagName('app-user-chats')[0]
      .getElementsByTagName('ion-footer')[0];
    this.inputElement = document
      .getElementsByTagName('app-user-chats')[0]
      .getElementsByTagName('textarea')[0];

    this.textareaHeight = Number(this.inputElement.style.height.replace('px', ''));
    this.initialTextAreaHeight = this.textareaHeight;
    this.updateScroll('load', 500);
  }

  getUserProfile() {
    const subscription = this.userService
      .getUserByUID(`${this.uid}`)
      .subscribe((userProfile: User) => {
        subscription.unsubscribe();
        this.otherUserProfile = userProfile;
        this.getMessages();
      });
  }

  getCurrentUserProfile() {
    const subscription = this.userService
      .getUserByUID(`${this.currentUserProfile.uid}`)
      .subscribe((userProfile: User) => {
        subscription.unsubscribe();
        this.currentUserProfile = userProfile;
      });
  }

  addKeyboardListeners() {
    this.keyboardHideSub = this.keyboard.onKeyboardHide().subscribe(() => {
      let newHeight = this.textareaHeight - this.initialTextAreaHeight + 44;
      let marginBottom = newHeight + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', '0px');
    });

    this.keybaordShowSub = this.keyboard.onKeyboardShow().subscribe(e => {
      let newHeight = e['keyboardHeight'] + this.textareaHeight - this.initialTextAreaHeight;
      let marginBottom = newHeight + 44 + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', e['keyboardHeight'] + 'px');
      this.updateScroll('keybaord show', this.scrollTimeout);
    });
  }

  async sendImageMessage() {
    if (this.chosenPicture) {
      this.loadingService.show();
      let imageId = this.db.createPushId();
      const imageStore = this.afStorage.storage
        .ref('/ChatImages')
        .child(`${this.currentUserProfile.uid}/${this.otherUserProfile.uid}/${imageId}`);
      await imageStore.putString(this.chosenPicture, 'data_url');
      const imageUrl = await imageStore.getDownloadURL();
      const image = { imageUrl: imageUrl, imageId: imageId };
      this.chatService.sendImageMessage(this.currentUserProfile, this.otherUserProfile, image);
      this.loadingService.hide();
    }
  }

  async changePicture(event: any) {
    event.preventDefault();
    const actionsheetCtrl = await this.actionSheetCtrl.create({
      header: 'Send photo',
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
      const picture = await this.cameraService.getPictureFromCamera(true);
      if (picture) {
        const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
        this.cameraService.generateFromImage(picture, quality, (data: any) => {
          this.chosenPicture =
            parseFloat(this.cameraService.getImageSize(picture)) >
            parseFloat(this.cameraService.getImageSize(data))
              ? data
              : picture;
          this.sendImageMessage();
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
      const picture = await this.cameraService.getPictureFromPhotoLibrary(true);
      if (picture) {
        const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
        this.cameraService.generateFromImage(picture, quality, (data: any) => {
          this.chosenPicture =
            parseFloat(this.cameraService.getImageSize(picture)) >
            parseFloat(this.cameraService.getImageSize(data))
              ? data
              : picture;
          this.sendImageMessage();
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

  getMessages() {
    this.chatSubscription = this.chatService
      .getMessages(this.currentUserProfile.uid, this.otherUserProfile.uid)
      .subscribe(messages => {
        console.log(messages);
        this.messages = messages;
        this.updateScroll('reply message', this.scrollTimeout);
      });
  }

  sendMessage(event: Event) {
    event.preventDefault();
    if (this.message !== '') {
      this.chatService.sendMessage(
        this.currentUserProfile,
        this.otherUserProfile,
        this.message.trim()
      );
      this.message = '';
      this.updateScroll('sendMessage', this.scrollTimeout);
      this.textareaHeight = this.initialTextAreaHeight;
    }
  }

  removeKeyboardListeners() {
    this.keyboardHideSub.unsubscribe();
    this.keybaordShowSub.unsubscribe();
  }

  contentMouseDown(event) {
    this.inputElement.blur();
  }

  footerTouchStart(event) {
    if (event.target.localName !== 'textarea') {
      event.preventDefault();
      this.updateScroll('', this.scrollTimeout);
    }
  }

  updateScroll(from, timeout) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout);
  }

  textAreaChange() {
    this.updateScroll('textAreaChange', this.scrollTimeout);
  }
}
