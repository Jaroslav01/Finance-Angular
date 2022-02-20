import { Component, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {map, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AppService} from "../app.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private _snackBar: MatSnackBar, private app: AppService) { }
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log(localStorage.getItem("access_token"));
    this.app.isQuery = true;
    request = request.clone({
      setHeaders: {
        Authorization: `${localStorage.getItem("access_token")}`
      }
    });
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 401) {
            let orderId = localStorage.getItem("orderId");
            localStorage.clear();
            if(orderId) localStorage.setItem("orderId", orderId);
            this.app.updateAUthorizedStatus();
            this.router.navigate(['/login']);
            window.location.href = "/login";
        }
        else if (response.status == 400) {

          this.openSnackBar(JSON.stringify(response.error))
        }
        this.app.isQuery = false;
        return throwError(response);
      }
    ));
  }
  openSnackBar(message: string){
    this._snackBar.open(message, "Скрыть",
    {
      duration: 3000
    });
  }
}

// @Component({
//   selector: 'snack-bar-component-example-snack',
//   templateUrl: 'snack-bar-component-example-snack.html',
//   styles: [`
//     .example-pizza-party {
//       color: hotpink;
//     }
//   `],
// })
// export class PizzaPartyComponent {}
