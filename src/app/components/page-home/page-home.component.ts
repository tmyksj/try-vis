import { Component, OnInit } from "@angular/core";
import { from, Observable } from "rxjs";
import { map, mergeMap, reduce } from "rxjs/operators";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";
import { ItemLogDto } from "../../dtos/item-log/item-log.dto";
import { ItemLogTypeDto } from "../../dtos/item-log-type/item-log-type.dto";

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
    this.itemDomain.recommendedItemList().subscribe((itemList: ItemDto[]): void => {
      this.recommendedItemList = itemList;
    });

    this.itemDomain.itemList().pipe(
      mergeMap((itemList: ItemDto[]): Observable<ItemDto> => {
        return from(itemList);
      }),
      mergeMap((item: ItemDto): Observable<ItemLogDto[]> => {
        return this.itemDomain.itemLogList(item);
      }),
      mergeMap((itemLog: ItemLogDto[]): Observable<ItemLogDto> => {
        return from(itemLog);
      }),
      map((itemLog: ItemLogDto): number => {
        switch (itemLog.type) {
          case ItemLogTypeDto.DoneToday:
            return 1;
          case ItemLogTypeDto.Done:
            return 2;
          default:
            return 0;
        }
      }),
      reduce((acc: number, value: number): number => {
        return acc + value;
      }),
    ).subscribe((steps: number): void => {
      this.steps = steps;
    });
  }

}
