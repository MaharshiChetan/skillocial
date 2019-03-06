import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private db: AngularFireDatabase) {}

  sendImageMessage(sender: User, receiver: User, image: any) {
    this.db.list(`chats/${sender.uid}/${receiver.uid}`).push({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${sender.uid}/${receiver.uid}`).update({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      username: receiver.username,
      profilePhoto: receiver.profilePhoto,
      fullName: receiver.fullName,
      bio: receiver.bio || '',
      timeStamp: '' + new Date(),
    });
    this.db.list(`chats/${receiver.uid}/${sender.uid}`).push({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${receiver.uid}/${sender.uid}`).update({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      username: sender.username,
      profilePhoto: sender.profilePhoto,
      fullName: sender.fullName,
      bio: sender.bio || '',
      timeStamp: '' + new Date(),
    });
  }

  sendMessage(sender: User, receiver: User, message: any) {
    this.db.list(`chats/${sender.uid}/${receiver.uid}`).push({
      message: message,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${sender.uid}/${receiver.uid}`).update({
      message: message,
      sentBy: sender.uid,
      username: receiver.username,
      profilePhoto: receiver.profilePhoto,
      thumbnail: receiver.thumbnail || receiver.profilePhoto,
      fullName: receiver.fullName,
      bio: receiver.bio || '',
      timeStamp: '' + new Date(),
    });
    this.db.list(`chats/${receiver.uid}/${sender.uid}`).push({
      message: message,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${receiver.uid}/${sender.uid}`).update({
      message: message,
      sentBy: sender.uid,
      username: sender.username,
      profilePhoto: sender.profilePhoto,
      thumbnail: sender.thumbnail || sender.profilePhoto,
      fullName: sender.fullName,
      bio: sender.bio || '',
      timeStamp: '' + new Date(),
    });
  }

  deleteMessage(senderId: string, receiverId: string, messageId: string) {
    this.db.list(`chats/${senderId}/${receiverId}/${messageId}`).remove();
    this.db.list(`chats/${receiverId}/${senderId}/${messageId}`).remove();
  }

  deleteAllMessages(senderId: string, receiverId: string) {
    this.db.list(`chats/${senderId}/${receiverId}`).remove();
    this.db.list(`displayChats/${senderId}/${receiverId}`).remove();
  }

  getDisplayMessages(senderId: string) {
    return this.db
      .list(`displayChats/${senderId}`, ref => ref.orderByChild('timeStamp'))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ id: a.key, ...a.payload.val() }))));
  }

  getMessages(senderId: string, receiverId: string) {
    return this.db
      .list(`chats/${senderId}/${receiverId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ id: a.key, ...a.payload.val() }))));
  }
}
