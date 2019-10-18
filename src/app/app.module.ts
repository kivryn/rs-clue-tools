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

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TimerComponent,
    MinuteSecondsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [ DBService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
