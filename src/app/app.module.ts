import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './components/welcome.component';
import { TimerComponent } from './components/timer.component';
import { DBService } from './services/d-b.service';
import { MinuteSecondsPipe } from './pipes/minute-seconds.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DexieComponent } from './components/dexie.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { CoordComponent } from './components/coord.component';
import { CoordModalComponent } from './components/coord-modal.component';
import { appDecimalDirective } from './directives/app.decimaldirective';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TimerComponent,
    MinuteSecondsPipe,
    DexieComponent,
    CoordComponent,
    CoordModalComponent,
    appDecimalDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ DBService ],
  bootstrap: [AppComponent],
  entryComponents: [CoordModalComponent]
})
export class AppModule { }
