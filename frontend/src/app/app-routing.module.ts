import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { StatsComponent } from './stats/stats.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './shared/login.guard';
import { MainGuard } from './shared/main.guard';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'play', canActivate: [MainGuard], component: PlayComponent },
  // { path: 'stats', canActivate: [MainGuard], component: StatsComponent },
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
  { path: '**', redirectTo: '/' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
