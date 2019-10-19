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

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TimerComponent,
    MinuteSecondsPipe,
    DexieComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [ DBService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
