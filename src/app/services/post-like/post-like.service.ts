import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class PostLikeService {
  constructor(
    private db: AngularFireDatabase,
  ) { }

  likePost(postID: string, uid: string) {
    return this.db.object(`postLikes/${postID}`).update({ [uid]: true });
  }

  checkLike(postID: string, uid: string) {
    return this.db.object(`postLikes/${postID}/${uid}`).snapshotChanges();
  }

  getTotalLikes(id: string) {
    // Used to build the likes count
    return this.db.list(`postLikes/${id}`).snapshotChanges().pipe(map(actions => actions.map(a => ({ uid: a.key }))));
  }

  unlikePost(postID: string, uid: string) {
    return this.db.object(`postLikes/${postID}/${uid}`).remove();
  }

  removePostLikes(id: string) {
    return this.db.object(`postLikes/${id}`).remove();
  }
}
