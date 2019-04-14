import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class PostCommentService {
  constructor(private db: AngularFireDatabase) { }

  addComment(postID: string, uid: string, comment: string) {
    return this.db.list(`postComments/${postID}`).push({
      uid: uid,
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      comment: comment,
    });
  }

  deleteAllComments(id: string) {
    return this.db.object(`postComments/${id}`).remove();
  }

  getAllComments(postID: string) {
    return this.db
      .list(`postComments/${postID}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ id: a.key, ...a.payload.val() }))));
  }

  getTotalComments(id: string) {
    // Used to build the comments count
    return this.db
      .list(`postComments/${id}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ id: a.key }))));
  }

  deleteComment(postID: string, commentID: string) {
    return this.db.object(`postComments/${postID}/${commentID}`).remove();
  }

  removePostComments(id: string) {
    return this.db.object(`postComments/${id}`).remove();
  }
}
