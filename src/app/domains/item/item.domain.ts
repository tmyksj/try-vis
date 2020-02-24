import { Injectable } from "@angular/core";
import { forkJoin, from, Observable, ObservableInput, throwError } from "rxjs";
import { filter, map, mergeMap, startWith } from "rxjs/operators";

import { Db } from "../../db/db";
import { ItemDto } from "../../dtos/item/item.dto";
import { ItemLogDto } from "../../dtos/item-log/item-log.dto";
import { ItemLogTypeDto } from "../../dtos/item-log-type/item-log-type.dto";

@Injectable({
  providedIn: "root",
})
export class ItemDomain {

  private db: Db;

  public constructor(db: Db) {
    this.db = db;
  }

  public delete(item: ItemDto): Observable<void> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return forkJoin([
      this.db.itemRepository.deleteById(item.id),
      this.db.itemLogRepository.findAll().pipe(
        mergeMap((value: ItemLogDto[]): ObservableInput<ItemLogDto> => {
          return from(value);
        }), filter((value: ItemLogDto): boolean => {
          return item.id === value.itemId;
        }), mergeMap((value: ItemLogDto): ObservableInput<void> => {
          return this.db.itemLogRepository.deleteById(value.id);
        }), startWith("emit least one item"),
      ),
    ]).pipe(map((_: any): void => {
    }));
  }

  public deleteLog(item: ItemDto, itemLog: ItemLogDto): Observable<void> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    } else if (itemLog.id === null) {
      return throwError(new Error("itemLog.id must not be null"));
    } else if (item.id !== itemLog.itemId) {
      return throwError(new Error("item.id and itemLog.itemId does not match"));
    }

    return this.db.itemLogRepository.deleteById(itemLog.id);
  }

  public itemList(): Observable<ItemDto[]> {
    return this.db.itemRepository.findAll();
  }

  public itemLogList(item: ItemDto): Observable<ItemLogDto[]> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.db.itemLogRepository.findAll().pipe(map((itemLog: ItemLogDto[]): ItemLogDto[] => {
      return itemLog.filter((value: ItemLogDto) => {
        return item.id === value.itemId;
      });
    }));
  }

  public recommendedItemList(): Observable<ItemDto[]> {
    // TODO: ちゃんとした推薦アルゴリズムを考える
    return this.itemList().pipe(map((item: ItemDto[]): ItemDto[] => {
      return item.slice(0, 3);
    }));
  }

  public save(item: ItemDto): Observable<ItemDto> {
    return this.db.itemRepository.save(item);
  }

  public saveLog(item: ItemDto, type: ItemLogTypeDto): Observable<void> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.db.itemLogRepository.save({
      id: null,
      itemId: item.id,
      type,
      createdAt: new Date(),
    }).pipe(map((_: ItemLogDto): void => {
    }));
  }

}
