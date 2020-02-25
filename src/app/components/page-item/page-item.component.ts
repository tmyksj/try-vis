import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";
import { ItemLogDto } from "../../dtos/item-log/item-log.dto";
import { ItemLogTypeDto } from "../../dtos/item-log-type/item-log-type.dto";

@Component({
  selector: "app-page-item",
  styleUrls: ["./page-item.component.scss"],
  templateUrl: "./page-item.component.html",
})
export class PageItemComponent implements OnInit {

  public readonly refItemLogTypeDto = ItemLogTypeDto;

  public isLoaded: boolean;

  public item: ItemDto;

  public itemLogList: ItemLogDto[];

  private itemDomain: ItemDomain;

  private route: ActivatedRoute;

  private router: Router;

  public constructor(itemDomain: ItemDomain, route: ActivatedRoute, router: Router) {
    this.itemDomain = itemDomain;
    this.route = route;
    this.router = router;
  }

  public ngOnInit(): void {
    this.isLoaded = false;

    const itemObservable: Observable<ItemDto> = this.route.paramMap.pipe(
      switchMap((params: ParamMap): Observable<ItemDto> => {
        return this.itemDomain.item(parseInt(params.get("id"), 10));
      }),
      map((item: ItemDto | null): ItemDto => {
        if (item === null) {
          throw new Error("cannot find item");
        }
        return item;
      }),
    );

    combineLatest([
      itemObservable,
      itemObservable.pipe(mergeMap((item: ItemDto): Observable<ItemLogDto[]> => {
        return this.itemDomain.itemLogList(item);
      })),
    ]).subscribe((value: [ItemDto, ItemLogDto[]]): void => {
      this.isLoaded = true;
      this.item = value[0];
      this.itemLogList = value[1].sort((a: ItemLogDto, b: ItemLogDto): number => {
        return b.id - a.id;
      });
    }, (_: any): void => {
      // TODO: redirect
      // this.router.navigateByUrl("/404");
    });
  }

  public onClickDelete(): void {
    this.itemDomain.delete(this.item).subscribe((): void => {
      this.router.navigateByUrl("/");
    });
  }

  public onClickLog(itemLogType: ItemLogTypeDto): void {
    this.itemDomain.saveLog(this.item, itemLogType).subscribe((): void => {
      this.router.navigateByUrl("/");
    });
  }

}
