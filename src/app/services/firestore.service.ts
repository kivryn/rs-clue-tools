import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { CompleteTime } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public completeTimes: Observable<any[]>;

  constructor(private fs: AngularFirestore) { 
  }

  createRecord(collection, data) {
    return new Promise<any>((resolve, reject) =>{
        this.fs
            .collection(collection)
            .add(data)
            .then(res => {}, err => reject(err));
    });
  }

  deleteRecord(collection, id) {
    return this.fs.collection(collection)
        .doc(id)
        .delete();
 }

  getTimes(type) { 
    return this.fs.collection('completeTimes', ref => ref.where('type', '==', type).orderBy('createTime')).snapshotChanges();
  }

  updateFortunate(id, data) {
    return this.fs.collection('completeTimes')
    .doc(id)
    .update({
      fortunateComponent: data
    });
  }

  updatePage(id, data) {
    return this.fs.collection('completeTimes')
    .doc(id)
    .update({
      godPage: data
    });
  }
}
