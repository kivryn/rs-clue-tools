import { Component, OnInit} from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { ITimeRecord } from '../services/app-db';
import { DBService } from '../services/d-b.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  private myTimerSub: Subscription;  
  ticks = 0;
  type = 'Easy';
  clicked = false;
  average = 0;
  records:ITimeRecord[] = []; //= [{id: 1, time: Date.now(), type: 'Easy', completeTime: 85},{id: 10, time: Date.now(), type: 'Easy', completeTime: 85}];

  constructor(private db: DBService) {
  }

  ngOnInit(){
    this.getRecords();
  }

  startTimer() {
    this.ticks = 0;
    this.clicked = false;
    const ti = timer(0,1000); 
    this.myTimerSub = ti.subscribe(t => {    
        this.ticks = t;  
    }); 
  }

  getRecords() {
    this.db.getTimes(this.type).then( res => {
      this.records = res;
      this.calculateAverage();
    });
  }

  calculateAverage() {
    this.average = 0;
    let cumulative = 0;
    let count = 0;
    for (const t of this.records) {
      count++;
      cumulative += t.completeTime;
      this.average = Math.floor(cumulative/ count);
    }
  }

  changeType(){
    this.getRecords();
  }

  stopTimer() {
    this.myTimerSub.unsubscribe();
    const t = this.ticks
    if (t > 0 && !this.clicked) {
      this.db.add({time: Date.now(), type: this.type, completeTime: t})
    } else {
      console.log('did not add')
    }
    this.clicked = true;
    this.getRecords();    
  }

  resetTimer() {
    this.ticks = 0;
  }

  deleteRecord(id) {
    this.db.remove(id);
    this.getRecords();
  }

  ngOnDestroy() {    
    this.myTimerSub.unsubscribe();    
  }
}
