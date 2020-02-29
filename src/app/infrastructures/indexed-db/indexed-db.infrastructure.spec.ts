import { TestBed } from "@angular/core/testing";

import { IndexedDbInfrastructure } from "./indexed-db.infrastructure";

describe("IndexedDbInfrastructure", () => {

  let infrastructure: IndexedDbInfrastructure;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    infrastructure = TestBed.inject(IndexedDbInfrastructure);
  });

  it("should be created", () => {
    expect(infrastructure).toBeTruthy();
  });

});
