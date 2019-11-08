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
  subscribed = false;
  ticks = 0;
  type = 'Medium';
  clicked = false;
  count = 0;
  average = 0;
  minTime = 0;
  maxTime = 0;
  averageSteps = 0;
  minSteps = 0;
  maxSteps = 0;
  averageStepTime = 0;
  cluesph = 0;
  averageFortsPerClue = 0;
  averageMastersPerClue = 0;
  averageMastersPerHour = 0;
  averageFortsPerHour = 0;
  current:CompleteTime = {
      createTime: 0,
      type: this.type,
      steps: 0,
      lapTime: [],
      completeTime: 0,
      fortunateComponent: 0,
      godPage: 0,
      masterClue: 0     
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
    this.minTime = this.records[0].completeTime;
    this.averageSteps = 0;
    let cumulative = 0, cumulFort = 0, cumulMaster = 0, cumulSteps = 0, count2 = 0;
    this.count = 0;
    this.minSteps = this.records[0].steps;
    for (const t of this.records) {
      this.count++;
      cumulative += t.completeTime;
      cumulFort += t.fortunateComponent;
      cumulMaster += t.masterClue;
      this.average = Math.floor(cumulative/ this.count);
      this.minTime = (t.completeTime < this.minTime) ? t.completeTime : this.minTime;
      this.maxTime = (t.completeTime > this.maxTime) ? t.completeTime : this.maxTime;
      this.cluesph = (60*60)/this.average;
      this.averageFortsPerClue = cumulFort/this.count;
      this.averageMastersPerClue = cumulMaster/(this.count-79);
      this.averageFortsPerHour = cumulFort/this.count * this.cluesph;
      this.averageMastersPerHour = cumulMaster/(this.count-79) * this.cluesph;
      
      if (t.steps > 0) {
        count2++;
        cumulSteps += t.steps;
        this.minSteps = (t.steps < this.minSteps) ? t.steps : this.minSteps;
        this.maxSteps = (t.steps > this.maxSteps) ? t.steps : this.maxSteps;
        this.averageSteps = cumulSteps/ count2;
      }
    }
  }

  startTimer() {
    if (this.subscribed === false) {
      this.subscribed = true;
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
    } else {
      console.log("already subscribed");
    }
  }

  stepTimer() {
    this.current.lapTime.push(this.ticks);
    this.current.steps++;
  }

  stopTimer() {
    this.subscribed = false;
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
    this.subscribed = false;
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

  minusMaster(id, master) {
    if(master > 0) {
      this.db.updateMaster(id, master-1).then(()=>{
        this.openSnackBar('Master Clue Count updated to: '+ (master-1), 'OK');
        this.getRecords();
      });
    } else {
      this.openSnackBar('Master Clue Count is already 0'!, 'OK')
    }
  }

  addMaster(id, master) {
    console.log(master+1);
    this.db.updateMaster(id, master+1).then(()=>{
      this.openSnackBar('Master Clue Count updated to: '+ (master+1), 'OK');
      this.getRecords();
    });
  }

  ngOnDestroy() {
    if(this.myTimerSub){
      this.myTimerSub.unsubscribe(); 
    }   
  }
}
