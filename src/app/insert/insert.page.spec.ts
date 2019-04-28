import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertPage } from './insert.page';

describe('InsertPage', () => {
  let component: InsertPage;
  let fixture: ComponentFixture<InsertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
