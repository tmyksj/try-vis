import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartItemListComponent } from './part-item-list.component';

describe('PartItemListComponent', () => {
  let component: PartItemListComponent;
  let fixture: ComponentFixture<PartItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
