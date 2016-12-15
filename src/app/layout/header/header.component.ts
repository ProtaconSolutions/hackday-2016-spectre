import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public team: any;

  public constructor(
    private angularFire: AngularFire,
    private router: Router,
    private localStorage: LocalStorageService
  ) { }

  public ngOnInit() {
    this.team = this.localStorage.retrieve('team');

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.team = value;
      });
  }

  public logout() {
    this.angularFire.auth.logout();

    this.router.navigate(['/login']);
  }
}
