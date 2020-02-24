import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PageItemEditComponent } from "./page-item-edit.component";

describe("PageItemEditComponent", () => {

  let component: PageItemEditComponent;
  let fixture: ComponentFixture<PageItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageItemEditComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
