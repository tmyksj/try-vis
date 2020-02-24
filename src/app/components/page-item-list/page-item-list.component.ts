import { Component, OnInit } from "@angular/core";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";

@Component({
  selector: "app-page-item-list",
  styleUrls: ["./page-item-list.component.scss"],
  templateUrl: "./page-item-list.component.html",
})
export class PageItemListComponent implements OnInit {

  public itemList: ItemDto[];

  private itemDomain: ItemDomain;

  public constructor(itemDomain: ItemDomain) {
    this.itemDomain = itemDomain;
  }

  public ngOnInit(): void {
    this.itemDomain.itemList().subscribe((itemList: ItemDto[]) => {
      this.itemList = itemList;
    });
  }

}
