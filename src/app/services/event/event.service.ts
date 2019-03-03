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

  async createEvent(event: Event) {
    return this.afStore.collection('events').add(event);
  }

  async updateEvent(event: Event, id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .update(event);
  }

  getEvent(id: string) {
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

  getEventDetails(id: string) {
    return this.afStore.collection<Event>(`events/${id}`).valueChanges();
  }

  async deleteEvent(id: string) {
    return this.afStore
      .collection('events')
      .doc(id)
      .delete();
  }

  async addUserToInterested(uid: string, eventId: string) {
    try {
      await this.afStore.collection('activeUsersInEvent').add({
        uid: uid,
        eventId: eventId,
        interested: 1,
        going: 0,
      });
    } catch (error) {
      throw error;
    }
  }

  getActiveUsersCount(eventId: string) {
    return this.afStore
      .collection('activeUsersCountInEvent')
      .doc(eventId)
      .valueChanges();
  }

  updateActiveUsersCount(eventId: string, interestedUsers: number, goingUsers: number) {
    return this.afStore
      .collection('activeUsersCountInEvent')
      .doc(eventId)
      .set({
        eventId: eventId,
        interestedUsers: interestedUsers,
        goingUsers: goingUsers,
      });
  }

  removeInterested(id: string) {
    return this.afStore
      .collection('activeUsersInEvent')
      .doc(id)
      .delete();
  }

  addUserToGoing(uid: string, eventId: string) {
    return this.afStore.collection('activeUsersInEvent').add({
      uid: uid,
      eventId: eventId,
      interested: 0,
      going: 1,
    });
  }

  removeGoing(id: string) {
    return this.afStore
      .collection('activeUsersInEvent')
      .doc(id)
      .delete();
  }

  getInterestedUsers(eventId: string) {
    return this.afStore
      .collection('activeUsersInEvent', ref =>
        ref.where('eventId', '==', eventId).where('interested', '==', 1)
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

  getGoingUsers(eventId: string) {
    return this.afStore
      .collection('activeUsersInEvent', ref =>
        ref.where('eventId', '==', eventId).where('going', '==', 1)
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

  isUserGoing(uid: string, eventId: string) {
    return this.afStore
      .collection('activeUsersInEvent', ref =>
        ref
          .where('uid', '==', uid)
          .where('eventId', '==', eventId)
          .where('going', '==', 1)
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

  isUserInterested(uid: string, eventId: string) {
    return this.afStore
      .collection('activeUsersInEvent', ref =>
        ref
          .where('uid', '==', uid)
          .where('eventId', '==', eventId)
          .where('interested', '==', 1)
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
}
