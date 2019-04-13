import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";
import { firestore } from "firebase";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class PostLikeService {
  constructor(
    private db: AngularFireDatabase,
    private afStore: AngularFirestore
  ) { }

  likePost(postID: string, uid: string) {
    const postLikes = firestore().collection("postLikes").doc(`${this.afStore.createId()}`);
    const post = firestore().collection("posts").doc(postID);
    const increment = firestore.FieldValue.increment(1);
    const batch = firestore().batch();

    batch.set(postLikes, { postID, uid, timeStamp: firestore.FieldValue.serverTimestamp() });
    batch.set(post, { likesCount: increment }, { merge: true });
    return batch.commit();
    // return this.db.object(`postLikes/${id}`).update({ [uid]: true });
  }

  checkLike(postID: string, uid: string) {
    return this.afStore
      .collection(`postLikes`, ref =>
        ref.where("postID", "==", postID).where("uid", "==", uid)
      )
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

    // return this.db.object(`postLikes/${id}/${uid}`).snapshotChanges();
  }

  // getTotalLikes(id: string) {
  //   // Used to build the likes count
  //   return this.db
  //     .list(`postLikes/${id}`)
  //     .snapshotChanges()
  //     .pipe(map(actions => actions.map(a => ({ uid: a.key }))));
  // }

  unlikePost(postID: string, likeID: string) {
    const postLikes = firestore().collection("postLikes").doc(likeID);
    const post = firestore().collection("posts").doc(postID);
    const decrement = firestore.FieldValue.increment(-1);
    const batch = firestore().batch();

    batch.delete(postLikes);
    batch.set(post, { likesCount: decrement }, { merge: true });
    return batch.commit();
    // return this.db.object(`postLikes/${id}/${uid}`).remove();
  }

  removePostLikes(id: string) {
    const postLikes = this.afStore.collection("postLikes", ref =>
      ref.where("postID", "==", id)
    );
    postLikes.get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
    });

    // return this.db.object(`postLikes/${id}`).remove();
  }
}
