import { Component, OnInit, Input } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit {
  @Input('messages') messages: any;
  @Input('otherUserProfile') otherUserProfile: any;
  @Input('currentUserProfile') currentUserProfile: any;

  constructor(
    private navCtrl: NavController,
    private clipboard: Clipboard,
    private chatService: ChatService,
    private actionSheetCtrl: ActionSheetController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  grayPlaceholder: string = 'assets/gray-placeholder.png';

  async presentPopover(message: any) {
    const actionsheet = await this.actionSheetCtrl.create({
      header: 'Take Action',
      buttons: [
        {
          text: 'Copy',
          icon: 'copy',
          handler: () => {
            if (message.imageUrl) {
              this.clipboard.copy(message.imageUrl);
            } else {
              this.clipboard.copy(message.message);
            }
            this.toastService.showToast('Text copied to clipboard!');
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.deleteMessage(message.id);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return actionsheet.present();
  }

  deleteMessage(messageId: string) {
    this.chatService.deleteMessage(
      this.currentUserProfile.uid,
      this.otherUserProfile.uid,
      messageId
    );
  }
}
