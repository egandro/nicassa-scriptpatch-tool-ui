import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlfileComponent } from './sqlfile.component';

describe('SqlfileComponent', () => {
  let component: SqlfileComponent;
  let fixture: ComponentFixture<SqlfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
