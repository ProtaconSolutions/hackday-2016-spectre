import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
import { TeamService } from '../../shared/services/';

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
    private localStorage: LocalStorageService,
    private teamService: TeamService,
  ) { }

  public ngOnInit(): void {
    this.teamService.team$.subscribe(team => { this.team = team; });

    this.uid = this.localStorage.retrieve('uid');

    this.localStorage
      .observe('uid')
      .subscribe((value) => {
        this.uid = value;
      });
  }

  public logout() {
    this.router.navigate(['/blank']).then(() => {
      this.angularFire.auth.logout();
      this.localStorage.clear();
    });
  }
}
