import { TestBed } from "@angular/core/testing";

import { ItemDomain } from "./item.domain";

describe("ItemDomain", () => {

  let domain: ItemDomain;

  beforeEach(() => {
    TestBed.configureTestingModule({
    });
    domain = TestBed.inject(ItemDomain);
  });

  it("should be created", () => {
    expect(domain).toBeTruthy();
  });

});
