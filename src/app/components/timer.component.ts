import { Component, OnInit} from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { CompleteTime } from '../models/model';
import { FirestoreService } from '../services/firestore.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  private myTimerSub: Subscription;  
  ticks = 0;
  type = 'Medium';
  clicked = false;
  average = 0;
  averageSteps = 0;
  cluesph = 0;
  averagePagesPerHour = 0;
  averageFortsPerHour = 0;
  current:CompleteTime = {
      createTime: 0,
      type: this.type,
      steps: 0,
      lapTime: [],
      completeTime: 0,
      fortunateComponent: 0,
      godPage: 0      
  }
  records:CompleteTime[] = []; 

  constructor(private db: FirestoreService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(){
    this.getRecords();
  }
  
  changeType(){
    this.getRecords();
  }

  getRecords() {
    this.db.getTimes(this.type).subscribe(r => {
      this.records = r.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as CompleteTime
      })
      console.log(this.records);
      this.calculateAverage();
    });
  }

  calculateAverage() {
    this.average = 0;
    this.averageSteps = 0;
    let cumulative = 0, cumulFort = 0, cumulPage = 0, cumulSteps = 0, count = 0, count2 = 0;
    for (const t of this.records) {
      count++;
      cumulative += t.completeTime;
      cumulFort += t.fortunateComponent;
      cumulPage += t.godPage;
      this.average = Math.floor(cumulative/ count);
      this.cluesph = (60*60)/this.average;
      this.averageFortsPerHour = cumulFort/count * this.cluesph;
      this.averagePagesPerHour = cumulPage/count * this.cluesph;
      
      if(t.steps > 0) {
        count2++;
        cumulSteps += t.steps;
        this.averageSteps = Math.floor(cumulSteps/ count2);
      }
    }
  }

  startTimer() {
    this.ticks = 0;
    this.clicked = false;
    const ti = timer(0,1000); 
    this.myTimerSub = ti.subscribe(t => {    
        this.ticks = t;  
    }); 

    this.current = {
        createTime: 0,
        type: this.type,
        steps: 0,
        lapTime: [],
        completeTime: 0,
        fortunateComponent: 0,
        godPage: 0  
    }
  }

  stepTimer() {
    this.current.lapTime.push(this.ticks);
    this.current.steps++;
  }

  stopTimer() {
    this.myTimerSub.unsubscribe();
    const t = this.ticks
    if (t > 0 && !this.clicked) {
      if (this.current.steps > 0) { this.stepTimer(); }
      this.current.createTime = Date.now();
      this.current.completeTime = t;
      this.db.createRecord('completeTimes', this.current);
      this.openSnackBar('Record saved at: '+formatDate(Date.now(), 'shortTime', 'en-US'), 'OK')
    } else {
      console.log('Did not add time - Counter not initialized.')
    }
    this.clicked = true;
    this.getRecords();    
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  resetTimer() {
    this.myTimerSub.unsubscribe(); 
    this.ticks = 0;
    this.current.steps = 0;
  }

  deleteRecord(id) {
    console.log(id);
    this.db.deleteRecord('completeTimes', id).then(()=>{
      this.getRecords();
    })
  }

  minusFort(id, forts) {
    if(forts > 0) {
      this.db.updateFortunate(id, forts-1).then(()=>{
        this.openSnackBar('Fortunate Count updated to: '+ (forts-1), 'OK');
        this.getRecords();
      });
    } else {
      this.openSnackBar('Fortunate Count is already 0'!, 'OK')
    }
  }

  addFort(id, forts) {
    this.db.updateFortunate(id, forts+1).then(()=>{
      this.openSnackBar('Fortunate Count updated to: '+ (forts+1), 'OK');
      this.getRecords();
    });
  }

  minusPage(id, pages) {
    if(pages > 0) {
      this.db.updatePage(id, pages-1).then(()=>{
        this.openSnackBar('God Page Count updated to: '+ (pages-1), 'OK');
        this.getRecords();
      });
    } else {
      this.openSnackBar('God Page Count is already 0'!, 'OK')
    }
  }

  addPage(id, pages) {
    console.log(pages+1);
    this.db.updatePage(id, pages+1).then(()=>{
      this.openSnackBar('God Page Count updated to: '+ (pages+1), 'OK');
      this.getRecords();
    });
  }

  ngOnDestroy() {    
    this.myTimerSub.unsubscribe();    
  }
}
