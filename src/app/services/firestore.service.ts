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

  getCoords(type) { 
    return this.fs.collection('coords', ref => ref.where('type', '==', type).orderBy('a')).snapshotChanges();
  }

  getUntypedCoords() { 
    return this.fs.collection('coords', ref => ref.where('type', '==', '').orderBy('a')).snapshotChanges();
  }

  updateCoord(id, data) {
    return this.fs.collection('coords')
    .doc(id)
    .update(data);
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

  updateMaster(id, data) {
    return this.fs.collection('completeTimes')
    .doc(id)
    .update({
      masterClue: data
    });
  }
}
