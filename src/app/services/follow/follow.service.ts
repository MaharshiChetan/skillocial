import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  isFollowing: boolean = false;
  constructor(private db: AngularFireDatabase) {}

  getFollowers(userId: string) {
    // Used to build the follower count
    return this.db
      .list(`followers/${userId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ uid: a.key }))));
  }

  getFollowings(userId: string) {
    // Used to build the following count
    return this.db
      .list(`following/${userId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ uid: a.key }))));
  }

  isUserFollowing(followerId: string, followedId: string) {
    // Used to see if UserOne if following UserTwo
    return this.db
      .object(`following/${followerId}/${followedId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.payload.val()));
  }

  follow(followerId: string, followedId: string) {
    this.db.object(`followers/${followedId}`).update({ [followerId]: true });
    this.db.object(`following/${followerId}`).update({ [followedId]: true });
  }

  unfollow(followerId: string, followedId: string) {
    this.db.object(`followers/${followedId}/${followerId}`).remove();
    this.db.object(`following/${followerId}/${followedId}`).remove();
  }

  updateFollowCount(followerId: string, followedId: string, followCount: any) {
    this.db.object(`followCount/${followedId}`).update({
      followersCount: followCount.followersCount,
    });
    return this.db.object(`followCount/${followerId}`).update({
      followingsCount: followCount.followingsCount,
    });
  }

  getFollowCount(uid: string) {
    return this.db.object(`followCount/${uid}`).valueChanges();
  }
}
