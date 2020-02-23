import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PageItemListComponent } from "./page-item-list.component";

describe("PageItemListComponent", () => {

  let component: PageItemListComponent;
  let fixture: ComponentFixture<PageItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageItemListComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
