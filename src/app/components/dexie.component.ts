import { Component, OnInit } from '@angular/core';
import { DBService } from '../services/d-b.service';

@Component({
  selector: 'app-dexie',
  templateUrl: './dexie.component.html',
  styleUrls: ['./dexie.component.css']
})
export class DexieComponent implements OnInit {

  constructor(private db: DBService) { }

  ngOnInit() {

  }

  exportDexie() {
    this.db.exportDB().then(r => console.log(JSON.stringify(r)));
  }
}
