import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome.component';
import { TimerComponent } from './components/timer.component';


const ROUTES: Routes = [
  { path: 'timer', component: TimerComponent},
  { path: '', component: WelcomeComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(ROUTES, {
  scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64]})], // [x, y]
  exports: [RouterModule]
})

export class AppRoutingModule { }
