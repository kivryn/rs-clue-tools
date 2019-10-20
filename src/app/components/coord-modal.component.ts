import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoordComponent } from './coord.component';
import { Coord, DialogData } from '../models/model';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-coord-modal',
  templateUrl: './coord-modal.component.html',
  styleUrls: ['./coord-modal.component.css']
})
export class CoordModalComponent implements OnInit {

  addRecord: Coord;
  pagetitle = "Add Co-ord";
  form: FormGroup;
  directions = ['N','S']
  directions2 = ['E',"W"]

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CoordComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: DialogData) {
      this.form = this.createFormGroup();
      this.addRecord = {...this.data.record};
      this.pagetitle = this.data.title;
    }

  ngOnInit() {
    this.form.patchValue(this.addRecord);
    // this.form.get('a').setValue(this.addRecord.a);
  }

  get f() { return this.form.controls; }
  dec = /^[0-9]{2}.[0-9]{2}$/;

  createFormGroup() {
    return new FormGroup({
     a: new FormControl('', [Validators.required, Validators.pattern(this.dec)]),
     b: new FormControl('', [Validators.required]),
     c: new FormControl('', [Validators.required, Validators.pattern(this.dec)]),
     d: new FormControl('', [Validators.required]),
     type: new FormControl(''),
     teleport: new FormControl('', [Validators.required]),
     challenge: new FormControl('', [Validators.required]),
     description: new FormControl('', [Validators.required]),
   });
 }

  onSubmit(f) {
    const v = this.form.value;
    this.addRecord = { id: this.addRecord.id, a: (v.a).toString(), b: v.b, 
      c: (v.c).toString(), d: v.d, type: v.type, teleport: v.teleport,
      challenge: v.challenge, description: v.description
    }
    console.log(this.addRecord);
    this.dialogRef.close({record: this.addRecord});
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
