import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {User} from "../../models/user.model";
import {AppService} from "../../app.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  constructor(
    private app: AppService,
    private http: HttpClient
  ) { }

  public user!: User;
  public accessToken = "";

  public userDataForm!: FormGroup;

  async ngOnInit() {
    let accessToken = localStorage.getItem("access_token");
    if (accessToken) this.accessToken = accessToken;
    await this.http.get<User>(environment.apiUrl + '/api/user/getCurrentUser').subscribe(response => {
      console.log(response)
      this.user = response;
      this.userDataForm = new FormGroup({
        firstname: new FormControl(this.user.firstname, [
          Validators.required
        ]),
        middlename: new FormControl(this.user.middlename, [
          Validators.required
        ]),
        lastname: new FormControl(this.user.lastname, [
          Validators.required
        ]),
        email: new FormControl(this.user.email, [
          Validators.required,
          Validators.email
        ]),
      });
      this.app.isQuery = false;
    });

  }

  updateUser() {
    this.http.post<User>(environment.apiUrl + '/api/user/updateUserData', this.userDataForm.value).subscribe(response =>{
      this.user = response;
      this.app.isQuery = false;
    });
  }
}
