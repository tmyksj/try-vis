import { Component, Input, OnInit } from "@angular/core";

import { ItemDto } from "../../dtos/item/item.dto";

@Component({
  selector: "app-part-item-list",
  styleUrls: ["./part-item-list.component.scss"],
  templateUrl: "./part-item-list.component.html",
})
export class PartItemListComponent implements OnInit {

  @Input()
  public itemList: ItemDto[];

  public constructor() {
    this.itemList = [];
  }

  public ngOnInit(): void {
  }

}
