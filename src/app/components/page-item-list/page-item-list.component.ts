import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";

@Component({
  selector: "app-page-item-list",
  styleUrls: ["./page-item-list.component.scss"],
  templateUrl: "./page-item-list.component.html",
})
export class PageItemListComponent implements OnInit {

  public isActivityMode: boolean;

  public itemList: ItemDto[];

  private itemDomain: ItemDomain;

  private router: Router;

  public constructor(itemDomain: ItemDomain, router: Router) {
    this.itemDomain = itemDomain;
    this.router = router;
  }

  public ngOnInit(): void {
    this.isActivityMode = this.router.url.includes("activity");

    let itemListObservable: Observable<ItemDto[]> | undefined;
    if (this.isActivityMode) {
      itemListObservable = this.itemDomain.itemList();
    } else {
      itemListObservable = this.itemDomain.pickupCurrentItemList();
    }

    itemListObservable.subscribe((itemList: ItemDto[]): void => {
      this.itemList = itemList.sort((a: ItemDto, b: ItemDto): number => {
        return b.id - a.id;
      });
    });
  }

}
