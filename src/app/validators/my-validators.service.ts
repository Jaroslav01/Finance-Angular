import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class MyValidatorsService {

  constructor() { }
  public checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get("password");
    let confirmPass = group.get('confirmPassword');
      return pass === confirmPass ? null : { notSame: true }
  }
  password(formGroup: FormGroup) {
    const { value: password }: any | null = formGroup.get('password');
    const { value: confirmPassword }: any | null = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
}
