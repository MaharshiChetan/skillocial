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
  event: Event;
  // imageStore = firebase.storage().ref('/eventImages');

  constructor(private db: AngularFireDatabase, private afStore: AngularFirestore) {}

  async createEvent(event: Event) {
    return this.afStore.collection('events').add(event);
  }

  async updateEvent(event: Event, id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .update(event);
  }

  getEventById(id: string) {
    return this.afStore
      .collection<Event>('events')
      .doc(id)
      .valueChanges();
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

  getMyEvents(uid: string) {
    return this.afStore
      .collection<Event[]>('events', ref => ref.where('uid', '==', uid))
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

  async deleteEvent(id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .delete();
  }
}
