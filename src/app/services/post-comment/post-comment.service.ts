import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PostCommentService {
  constructor(private db: AngularFireDatabase, private afStore: AngularFirestore) { }

  addComment(postID: string, uid: string, comment: string) {
    const postComments = firestore().collection('postComments').doc(`${this.afStore.createId()}`);
    const post = firestore().collection('posts').doc(postID);
    const increment = firestore.FieldValue.increment(1);
    const batch = firestore().batch();

    batch.set(postComments, { postID, uid, comment, timeStamp: firestore.FieldValue.serverTimestamp() });
    batch.set(post, { commentsCount: increment }, { merge: true });
    return batch.commit();

    // return this.db.list(`postComments/${postID}`).push({
    //   uid: uid,
    //   timeStamp: firebase.database.ServerValue.TIMESTAMP,
    //   comment: comment,
    // });
  }

  deleteAllComments(id: string) {
    return this.db.object(`postComments/${id}`).remove();
  }

  getAllComments(postID: string) {
    return this.afStore.collection('postComments',
      ref => ref.orderBy('timeStamp').where('postID', '==', postID)
    ).snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
    // return this.db
    //   .list(`postComments/${id}`)
    //   .snapshotChanges()
    //   .pipe(map(actions => actions.map(a => ({ id: a.key, ...a.payload.val() }))));
  }

  // getTotalComments(id: string) {
  //   // Used to build the comments count
  //   return this.db
  //     .list(`postComments/${id}`)
  //     .snapshotChanges()
  //     .pipe(map(actions => actions.map(a => ({ id: a.key }))));
  // }

  deleteComment(postID: string, commentID: string) {
    const postComment = firestore().collection('postComments').doc(commentID);
    const post = firestore().collection('posts').doc(postID);
    const decrement = firestore.FieldValue.increment(-1);
    const batch = firestore().batch();

    batch.delete(postComment);
    batch.set(post, { commentsCount: decrement }, { merge: true });
    return batch.commit();

    // return this.db.object(`postComments/${postID}/${commentID}`).remove();
  }

  removePostComments(id: string) {
    return this.db.object(`postComments/${id}`).remove();
  }
}
