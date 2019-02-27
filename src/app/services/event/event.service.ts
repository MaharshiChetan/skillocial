import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from 'src/app/models/event';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  imageStore: any;
  // imageStore = firebase.storage().ref('/eventImages');

  constructor(private db: AngularFireDatabase, private afStore: AngularFirestore) {}

  async createEvent(event: Event, id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .set(event);
  }

  async updateEvent(event: Event, id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .update(event);
  }

  getEvents() {
    return this.afStore
      .collection<Event[]>('events', ref => ref.orderBy('startDate'))
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

  getEventDetails(id: string) {
    return this.afStore.collection<Event>(`events/${id}`).valueChanges();
  }

  async deleteEvent(id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .delete();
  }

  fetchEvents() {
    try {
      return this.db
        .list('events', ref => ref.orderByChild('startDate'))
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
    } catch (e) {
      console.log(e);
    }
  }
}
