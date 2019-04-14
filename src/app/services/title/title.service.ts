import { Injectable } from '@angular/core';
import { Title } from 'src/app/models/title';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(private afStore: AngularFirestore) { }

  async addTitle(title: Title): Promise<any> {
    return this.afStore.collection<Title>('titles').add(title);
  }

  async updateTitle(title: Title, id: string): Promise<any> {
    return this.afStore.collection<Title>('titles').doc(id).update(title);
  }

  getTitles(uid: string) {
    return this.afStore
      .collection<Title[]>('titles', ref =>
        ref.where('uid', '==', uid).orderBy('createdAt', 'desc')
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

  getTopSixTitles(uid: string) {
    return this.afStore
      .collection<Title[]>('titles', ref =>
        ref
          .where('uid', '==', uid)
          .orderBy('createdAt', 'desc')
          .limit(6)
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

  getTitleById(id: string) {
    return this.afStore.collection<Title[]>('titles').doc(id).valueChanges();
  }

  deleteTitle(id: string) {
    return this.afStore.collection('titles').doc(id).delete();
  }
}
