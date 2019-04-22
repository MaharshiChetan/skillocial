import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { ModalController, IonContent, Platform, ActionSheetController, NavParams } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { PostCommentService } from 'src/app/services/post-comment/post-comment.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  inputElement: any;
  millis = 200;
  scrollTimeout = this.millis + 50;
  textareaHeight: any;
  scrollContentElement: any;
  footerElement: any;
  initialTextAreaHeight: any;
  keyboardHideSub: any;
  keybaordShowSub: any;
  comment: string;
  post: any;
  comments: { uid: string }[];

  constructor(
    public userService: UserService,
    private modalCtrl: ModalController,
    private platform: Platform,
    private keyboard: Keyboard,
    private renderer: Renderer,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private clipboard: Clipboard,
    private postCommentService: PostCommentService
  ) {}

  async ngOnInit() {
    this.post = this.navParams.get('post');
    this.getAllPostComments();
    if (this.platform.is('ios')) {
      this.addKeyboardListeners();
    }
    this.scrollContentElement = this.content.getScrollElement();
    this.footerElement = document.getElementsByTagName('app-comments')[0].getElementsByTagName('ion-footer')[0];
    this.inputElement = document.getElementsByTagName('app-comments')[0].getElementsByTagName('textarea')[0];
    this.textareaHeight = Number(this.inputElement.style.height.replace('px', ''));
    this.initialTextAreaHeight = this.textareaHeight;
    this.updateScroll(500);
  }

  async dismissModal() {
    await this.modalCtrl.dismiss();
  }

  removeKeyboardListeners() {
    this.keyboardHideSub.unsubscribe();
    this.keybaordShowSub.unsubscribe();
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

  async addComment(event: Event) {
    event.preventDefault();
    alert();
    await this.postCommentService.addComment(this.post.id, this.userService.currentUserProfile.uid, this.comment);
    this.comment = '';
    this.getAllPostComments();
  }

  getAllPostComments() {
    this.comments = null;
    const subscription = this.postCommentService.getAllComments(this.post.id).subscribe((comments: any) => {
      subscription.unsubscribe();
      this.comments = comments;
      this.comments.forEach((comment: any, i: number) => {
        const userSubscription = this.userService.getUserByUID(comment.uid).subscribe((userProfile: User) => {
          this.comments[i]['userProfile'] = userProfile;
          userSubscription.unsubscribe();
        });
      });
      this.updateScroll(this.scrollTimeout);
    });
  }

  async showActionSheet(postId: string, comment: any) {
    if (this.userService.currentUserProfile.uid === comment.uid) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Take Action',
        buttons: [
          {
            text: 'Delete',
            icon: 'trash',
            handler: async () => {
              await this.postCommentService.deleteComment(postId, comment.id);
              this.getAllPostComments();
            }
          },
          {
            text: 'Copy',
            icon: 'copy',
            handler: () => {
              this.clipboard.copy(comment.comment);
            }
          },
          {
            text: 'Cancel',
            icon: !this.platform.is('ios') ? 'close' : null,
            role: 'destructive',
            handler: () => {
              console.log('the user has cancelled the interaction.');
            }
          }
        ]
      });
      await actionSheet.present();
    }
  }
}
