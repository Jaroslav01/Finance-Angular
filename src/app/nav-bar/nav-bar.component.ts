import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppService} from "../app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent implements OnInit {

  constructor(
    public app: AppService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logOut(): void {
    localStorage.clear();
    this.app.updateAUthorizedStatus();
    this.router.navigate(['/login']);
  }
}
