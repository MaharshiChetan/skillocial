import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class PostCommentService {
  constructor(private db: AngularFireDatabase) {}

  createComment(id: string, uid: string, comment: string) {
    this.db.list(`postComments/${id}`).push({
      uid: uid,
      date: firebase.database.ServerValue.TIMESTAMP,
      comment: comment,
    });
  }

  deleteAllComments(id: string) {
    this.db.object(`postComments/${id}`).remove();
  }

  getAllComments(id: string) {
    return this.db
      .list(`postComments/${id}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ uid: a.key, ...a.payload.val() }))));
  }

  getTotalComments(id: string) {
    // Used to build the comments count
    return this.db
      .list(`postComments/${id}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ uid: a.key }))));
  }

  deleteComment(id: string, commentId: string) {
    this.db.object(`postComments/${id}/${commentId}`).remove();
  }

  removePostComments(id: string) {
    this.db.object(`postComments/${id}`).remove();
  }
}
