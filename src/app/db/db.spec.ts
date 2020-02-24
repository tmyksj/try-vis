import { TestBed } from "@angular/core/testing";

import { Db } from "./db";

describe("Db", () => {

  let db: Db;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    db = TestBed.inject(Db);
  });

  it("should be created", () => {
    expect(db).toBeTruthy();
  });

});
