import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostLikeService {
  constructor(private db: AngularFireDatabase) { }

  likePost(id: string, uid: string) {
    return this.db.object(`postLikes/${id}`).update({ [uid]: true });

    // const postLikes = firestore().collection('postLikes').doc(`${this.afStore.createId()}`);
    // const post = firestore().collection('posts').doc(postId);
    // const increment = firestore.FieldValue.increment(1);
    // const batch = firestore().batch();

    // batch.set(postLikes, { postId, uid });
    // batch.set(post, { likesCount: increment }, { merge: true });
  }

  checkLike(id: string, uid: string) {
    return this.db.object(`postLikes/${id}/${uid}`).snapshotChanges();
  }

  getTotalLikes(id: string) {
    // Used to build the likes count
    return this.db
      .list(`postLikes/${id}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ uid: a.key }))));
  }

  unlikePost(id: string, uid: string) {
    return this.db.object(`postLikes/${id}/${uid}`).remove();

    // const postLikes = firestore().collection('postLikes').doc(`${this.afStore.createId()}`);
    // const post = firestore().collection('posts').doc(postId);
    // const increment = firestore.FieldValue.decrement(1);
    // const batch = firestore().batch();

    // batch.set(postLikes, { postId, uid });
    // batch.set(post, { likesCount: increment }, { merge: true });
  }

  removePostLikes(id: string) {
    return this.db.object(`postLikes/${id}`).remove();
  }
}
