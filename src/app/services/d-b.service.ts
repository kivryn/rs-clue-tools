import { Injectable } from '@angular/core';
import { AppDb, ITimeRecord } from './app-db';

@Injectable({
  providedIn: 'root'
})
export class DBService {

    db: any;

    constructor() {
        this.db = new AppDb();
    }

    getTimes(type: string) {
      return this.db.timeRecords.where("type").equals(type).reverse().toArray();
    }

    getUsers(firstName, lastName) {
        return this.db.users.where({firstName, lastName}).reverse().sortBy('id');
    }

    add(data) {
    return this.db.timeRecords.add(data);
    }

    update(id, data) {
    return this.db.timeRecords.update(id, data);
    }

    remove(id) {
    return this.db.timeRecords.delete(id);
    }
  }