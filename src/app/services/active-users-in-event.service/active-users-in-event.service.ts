import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ActiveUsersInEventService {
  constructor(private db: AngularFireDatabase) {}

  getActiveUsers(eventId: string, type: string) {
    return this.db
      .list(`activeUsersInEvent/${eventId}/${type}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ uid: a.key, ...a.payload.val() }))));
  }

  addActiveUser(eventId: string, uid: string, type: string) {
    return this.db.object(`activeUsersInEvent/${eventId}/${type}`).update({ [uid]: true });
  }

  removeActiveUser(eventId: string, uid: string, type: string) {
    return this.db.object(`activeUsersInEvent/${eventId}/${type}/${uid}`).remove();
  }

  isActiveUser(eventId: string, uid: string, type: string) {
    return this.db
      .object(`activeUsersInEvent/${eventId}/${type}/${uid}`)
      .snapshotChanges()
      .pipe(map(actions => actions.payload.val()));
  }

  addShare(eventId: string, uid: string) {
    return this.db.object(`activeUsersInEvent/${eventId}/shares`).update({ [uid]: true });
  }

  updateActiveUsersCount(eventId: string, usersCount: any) {
    return this.db.object(`activeUsersCountInEvent/${eventId}`).update(usersCount);
  }

  getActiveUsersCount(eventId: string) {
    return this.db.object(`activeUsersCountInEvent/${eventId}`).valueChanges();
  }
}
