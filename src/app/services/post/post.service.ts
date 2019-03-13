import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from 'src/app/models/post';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private afStore: AngularFirestore) {}

  async addPost(post: Post): Promise<any> {
    return this.afStore.collection<Post>('posts').add(post);
  }

  async updatePost(post: Post, id: string): Promise<any> {
    return this.afStore
      .collection<Post>('posts')
      .doc(id)
      .update(post);
  }

  getPosts(uid: string) {
    return this.afStore
      .collection<Post[]>('posts', ref => ref.where('uid', '==', uid).orderBy('createdAt', 'desc'))
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

  getTopNinePosts(uid: string) {
    return this.afStore
      .collection<Post[]>('posts', ref =>
        ref
          .where('uid', '==', uid)
          .orderBy('createdAt', 'desc')
          .limit(9)
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
  }

  getPostById(id: string) {
    return this.afStore
      .collection<Post[]>('posts')
      .doc(id)
      .valueChanges();
  }

  deletePost(id: string) {
    return this.afStore
      .collection('posts')
      .doc(id)
      .delete();
  }
}
