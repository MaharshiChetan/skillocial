import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventPaymentService {
  constructor(private afStore: AngularFirestore) {}

  addPayment(paymentDetails: any) {
    return this.afStore.collection('eventPayment').add(paymentDetails);
  }
}
