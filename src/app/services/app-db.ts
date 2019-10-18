import Dexie from 'dexie';

export interface ITimeRecord {
    id: number;
    time: number;
    type: string;
    completeTime: number;
}

export class AppDb extends Dexie {
    times: Dexie.Table<ITimeRecord, string>;  // Type of Object and Primary Key

    constructor() {
      super('TimeRecords'); // Name of Database
      this.version(1).stores({
        timeRecords: 'id++,time,type,completeTime'
      });
    }
  }