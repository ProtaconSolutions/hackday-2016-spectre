import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-retros',
  templateUrl: './retros.component.html',
  styleUrls: ['./retros.component.scss']
})
export class RetrosComponent implements OnInit {
  public retros: FirebaseListObservable<any[]>;
  public team: any;

  constructor(
    private angularFire: AngularFire,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    this.team = this.localStorage.retrieve('team');
    this.retros = this.angularFire.database.list('/retros/'+this.team.$key);

    this.localStorage
      .observe('team')
      .subscribe((value) => {
        this.team = value;
        this.retros = this.angularFire.database.list('/retros/'+this.team.$key);
      });
  }

}
