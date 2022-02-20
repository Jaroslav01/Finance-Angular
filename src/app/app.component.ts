import { Component } from '@angular/core';
import {AppService} from "./app.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {User} from "./models/user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Finance';
  constructor(
    private http: HttpClient,
    private app: AppService
  ) {
    if (localStorage.getItem("access_token") != null){
      http.get<User>(environment.apiUrl + '/api/user/getCurrentUser').subscribe(user => {
        app.username = user.firstname + " " + user.lastname;
      });
    }

  }
}
