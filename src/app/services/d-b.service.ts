import { Injectable } from '@angular/core';
import { AppDb, ITimeRecord } from './app-db';
import Dexie from "dexie";
import {importDB, exportDB, importInto} from "dexie-export-import";
import 'dexie-export-import';

export interface TableDump {
  table: string
  rows: any[]
}

@Injectable({
  providedIn: 'root'
})
export class DBService {

    db: any;
    saved: any;

    constructor() {
        this.db = new AppDb();
    }

    exportDB = async () => {
      console.log(this.db);
      const blob = await this.db.export();
      console.log(JSON.stringify(blob));
      return blob;
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