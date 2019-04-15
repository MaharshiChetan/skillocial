import { Component, OnInit, ViewChild, Renderer, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, Platform, ActionSheetController } from '@ionic/angular';
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
export class UserChatsPage implements OnInit, OnDestroy {
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
  chatSubscription: any;
  message: string = '';

  constructor(
    public cameraService: CameraService,
    private route: ActivatedRoute,
    private userService: UserService,
    private chatService: ChatService,
    private loadingService: LoadingService,
    private keyboard: Keyboard,
    private renderer: Renderer,
    private afStorage: AngularFireStorage,
    private platform: Platform,
    private db: AngularFireDatabase,
    private actionsheetCtrl: ActionSheetController
  ) { }

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
    this.updateScroll(500);
  }

  ngOnDestroy() {
    this.cameraService.chosenPicture = null;
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
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

  async changePicture(event?: any) {
    if (event) event.preventDefault();
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
          this.cameraService.chosenPicture =
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
          this.cameraService.chosenPicture =
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
      this.updateScroll(this.scrollTimeout);
    });
  }

  async sendImageMessage() {
    if (this.cameraService.chosenPicture) {
      try {
        await this.loadingService.show();
        let imageId = this.db.createPushId();
        const imageStore = this.afStorage.storage
          .ref('/chatImages')
          .child(`${this.currentUserProfile.uid}/${this.otherUserProfile.uid}/${imageId}`);
        await imageStore.putString(this.cameraService.chosenPicture, 'data_url');
        const imageUrl = await imageStore.getDownloadURL();
        const image = { imageUrl: imageUrl, imageId: imageId };
        this.chatService.sendImageMessage(this.currentUserProfile, this.otherUserProfile, image);
        await this.loadingService.hide();
      } catch (error) {
        await this.loadingService.hide();
        alert(error);
      }
    }
  }

  getMessages() {
    this.chatSubscription = this.chatService
      .getMessages(this.currentUserProfile.uid, this.otherUserProfile.uid)
      .subscribe(messages => {
        console.log(messages);
        this.messages = messages;
        this.updateScroll(this.scrollTimeout);
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
      this.updateScroll(this.scrollTimeout);
      this.textareaHeight = this.initialTextAreaHeight;
    }
  }

  removeKeyboardListeners() {
    this.keyboardHideSub.unsubscribe();
    this.keybaordShowSub.unsubscribe();
  }

  footerTouchStart(event: any) {
    if (event.target.localName !== 'textarea') {
      event.preventDefault();
      this.updateScroll(this.scrollTimeout);
    }
  }

  updateScroll(timeout: number) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout);
  }

  textAreaChange() {
    this.updateScroll(this.scrollTimeout);
  }
}
