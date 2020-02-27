import { Component, OnInit } from "@angular/core";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";

@Component({
  selector: "app-page-home",
  styleUrls: ["./page-home.component.scss"],
  templateUrl: "./page-home.component.html",
})
export class PageHomeComponent implements OnInit {

  public recommendedItemList: ItemDto[];

  public steps: number;

  private itemDomain: ItemDomain;

  public constructor(itemDomain: ItemDomain) {
    this.itemDomain = itemDomain;
  }

  public ngOnInit(): void {
    this.itemDomain.accumulateSteps().subscribe((steps: number): void => {
      this.steps = steps;
    });

    this.itemDomain.pickupRecommendedItemList().subscribe((itemList: ItemDto[]): void => {
      this.recommendedItemList = itemList;
    });
  }

}
