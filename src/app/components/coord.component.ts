import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { CoordModalComponent } from './coord-modal.component';
import { Coord } from '../models/model';

@Component({
  selector: 'app-coord',
  templateUrl: './coord.component.html',
  styleUrls: ['./coord.component.css']
})
export class CoordComponent implements OnInit {

  type = 'Medium';
  records: Coord[] = []; // [{a:"00.00", b:"N", c:"00.00", d:"E", type:"Medium", teleport:"Nexus",
  records2: Coord[] = [];
  savedRecords: Coord[] = [];

  constructor(private db: FirestoreService, private _snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getRecords();
    this.getUntypedRecords();
  }
  
  changeType(){
    this.getRecords();
    this.getUntypedRecords();
  }

  getRecords() {
    this.db.getCoords(this.type).subscribe(r => {
      this.records = r.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Coord
      })
      console.log(this.records);
    });
  }

  getUntypedRecords() {
    this.db.getUntypedCoords().subscribe(r => {
      this.records2 = r.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Coord
      })
      this.records = [ ...this.records, ...this.records2];
      this.records = this.records.sort((a,b) => {
        return a.a >b.a?1:a.a <b.a?-1:0
       });
       this.savedRecords = [...this.records];
      console.log(this.records2);
    });
  }
  

  openDialog(record){
    const dialogRef = this.dialog.open(CoordModalComponent, {
      width: '500px',
      data: {record: record, title: 'Edit Co-ord'}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      
      if (result !== undefined) { 
          this.db.updateCoord(result.record.id, result.record);
          console.log('Item was updated'); 
        }
    });
  }

  filtered(e) {
    console.log(this.savedRecords);
    console.log(e.target.value);
    this.records = this.savedRecords.filter(el => el.a.toString().startsWith(e.target.value));
  }

}