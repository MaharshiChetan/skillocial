import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlockUserService {
  constructor(private afStore: AngularFirestore) {}

  blockUser(blockUserDetails: any) {
    return this.afStore.collection('blockedUsers').add(blockUserDetails);
  }

  unblockUser(id: string) {
    return this.afStore
      .collection('blockedUsers')
      .doc(id)
      .delete();
  }

  isBlockedUser(currentUID: string, uid: string) {
    return this.afStore
      .collection('blockedUsers', ref => ref.where('blockedByUID', '==', currentUID).where('blockedUID', '==', uid))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getBlockedUsers(currentUID: string) {
    return this.afStore
      .collection('blockedUsers', ref => ref.where('blockedByUID', '==', currentUID))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
