import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./models/user.model";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService{

  constructor(
  ) {
    this.updateAUthorizedStatus();
  }
  username = "Firstname Lastname"
  isAuthorized = false;
  isQuery = false;
  // public navBarChange = new BehaviorSubject<boolean> (false);
  updateAUthorizedStatus(){
    this.isAuthorized = localStorage.getItem("access_token") != null;
    console.log(this.isAuthorized)
  }


}
