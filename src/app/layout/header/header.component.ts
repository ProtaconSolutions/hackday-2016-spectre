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
  public uid: string;

  public constructor(
    private angularFire: AngularFire,
    private router: Router,
    private localStorage: LocalStorageService
  ) { }

  public ngOnInit() {
    this.team = this.localStorage.retrieve('team');
    this.uid = this.localStorage.retrieve('uid');

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.team = value;
      });

    this.localStorage
      .observe('uid')
      .subscribe((value) => {
        this.uid = value;
      });
  }

  public logout() {
    this.angularFire.auth.logout();
    this.localStorage.clear();

    this.router.navigate(['/blank']);
  }
}
