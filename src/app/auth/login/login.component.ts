import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MyValidatorsService} from "../../validators/my-validators.service";
import {HttpClient} from "@angular/common/http";
import {AppService} from "../../app.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment.prod";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  restoreForm!: FormGroup;

  constructor(
    private myValidatorsService: MyValidatorsService,
    private http: HttpClient,
    private app: AppService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.email

      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8)
      ])
    });

    this.signUpForm = new FormGroup({
      firstname: new FormControl("", [
        Validators.required,
      ]),
      middlename: new FormControl("", [
        Validators.required
      ]),
      lastname: new FormControl("", [
        Validators.required
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(8)
      ]),
    });

    this.restoreForm = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.email

      ]),
    });
  }

  ngOnInit(): void {

  }

  async login() {
    console.log(this.loginForm.value)
    await this.http.post<any>(environment.apiUrl + '/api/auth/login', this.loginForm.value).subscribe(response => {
      console.log(response)
      localStorage.setItem("access_token", response.token)
      this.app.updateAUthorizedStatus()
      if (localStorage.getItem("access_token") != null){
        this.http.get<User>(environment.apiUrl + '/api/user/getCurrentUser').subscribe(user => {
          this.app.username = user.firstname + " " + user.lastname;
        });
      }
      this.router.navigate(['/']);
    });
    // this.loginForm.get("password")?.setValue("");
  }

  signUp() {
    console.log(this.loginForm.value)
    this.http.post<any>(environment.apiUrl + '/api/auth/signup', this.signUpForm.value).subscribe(response => {
      this.loginForm.get("username")?.setValue(this.signUpForm.get("email")?.value);
      this.loginForm.get("password")?.setValue(this.signUpForm.get("password")?.value);
      this.login();
    });
  }

  restore() {

  }
}
