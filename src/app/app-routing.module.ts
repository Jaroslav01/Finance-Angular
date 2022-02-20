import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./errors/page-not-found/page-not-found.component";
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {LoginComponent} from "./auth/login/login.component";
import {UserSettingsComponent} from "./user/user-settings/user-settings.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' ,
    canActivate: [AuthGuard]
  },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-settings', component: UserSettingsComponent ,
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
