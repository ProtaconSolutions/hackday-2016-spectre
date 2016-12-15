import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public constructor(
    private angularFire: AngularFire,
    private router: Router
  ) { }

  public ngOnInit() {}

  public logout() {
    this.angularFire.auth.logout();

    this.router.navigate(['/login']);
  }
}
