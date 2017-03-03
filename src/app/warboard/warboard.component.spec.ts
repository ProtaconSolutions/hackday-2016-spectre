/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WarboardComponent } from './warboard.component';

describe('WarboardComponent', () => {
  let component: WarboardComponent;
  let fixture: ComponentFixture<WarboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
