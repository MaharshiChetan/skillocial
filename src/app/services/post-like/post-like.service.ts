import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostLikeService {
  constructor(private db: AngularFireDatabase) {}

  likePost(id: string, uid: string) {
    return this.db.object(`postLikes/${id}`).update({ [uid]: true });
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
  }

  removePostLikes(id: string) {
    return this.db.object(`postLikes/${id}`).remove();
  }
}
