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

  public accumulateSteps(): Observable<number> {
    return this.db.itemLogRepository.findAll().pipe(
      map((itemLogList: ItemLogDto[]): number => {
        return itemLogList.map((itemLog: ItemLogDto): number => {
          switch (itemLog.type) {
            case ItemLogTypeDto.DoneToday:
              return 1;
            case ItemLogTypeDto.Done:
              return 2;
            default:
              return 0;
          }
        }).reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        }, 0);
      }),
    );
  }

  public pickupRecommendedItemList(): Observable<ItemDto[]> {
    // TODO: ちゃんとした推薦アルゴリズムを考える
    return this.itemList().pipe(map((itemList: ItemDto[]): ItemDto[] => {
      return itemList.slice(0, 3);
    }));
  }

  public isLoggable(item: ItemDto, itemLogType: ItemLogTypeDto): Observable<boolean> {
    switch (itemLogType) {
      case ItemLogTypeDto.Later:
        // fall through
      case ItemLogTypeDto.DoneToday:
        return forkJoin([
          this.isLoggedSinceToday(item, ItemLogTypeDto.DoneToday),
          this.isLogged(item, ItemLogTypeDto.Done),
          this.isLogged(item, ItemLogTypeDto.Quit),
        ]).pipe(
          map((value: [boolean, boolean, boolean]): boolean => {
            return !value[0] && !value[1] && !value[2];
          }),
        );
      case ItemLogTypeDto.Done:
        // fall through
      case ItemLogTypeDto.Quit:
        return forkJoin([
          this.isLogged(item, ItemLogTypeDto.Done),
          this.isLogged(item, ItemLogTypeDto.Quit),
        ]).pipe(
          map((value: [boolean, boolean]): boolean => {
            return !value[0] && !value[1];
          }),
        );
    }
  }

  public delete(item: ItemDto): Observable<void> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return forkJoin([
      this.db.itemRepository.deleteById(item.id),
      this.db.itemLogRepository.findAll().pipe(
        mergeMap((itemLogList: ItemLogDto[]): ObservableInput<ItemLogDto> => {
          return from(itemLogList);
        }),
        filter((itemLog: ItemLogDto): boolean => {
          return item.id === itemLog.itemId;
        }),
        mergeMap((itemLog: ItemLogDto): ObservableInput<void> => {
          return this.db.itemLogRepository.deleteById(itemLog.id);
        }),
        startWith("emit least one item"),
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

  public item(id: number): Observable<ItemDto | null> {
    return this.db.itemRepository.findById(id);
  }

  public itemList(): Observable<ItemDto[]> {
    return this.db.itemRepository.findAll();
  }

  public itemLog(item: ItemDto, id: number): Observable<ItemLogDto | null> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.db.itemLogRepository.findById(id).pipe(map((itemLog: ItemLogDto | null): ItemLogDto | null => {
      if (itemLog === null || item.id !== itemLog.id) {
        return null;
      }
      return itemLog;
    }));
  }

  public itemLogList(item: ItemDto): Observable<ItemLogDto[]> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.db.itemLogRepository.findAll().pipe(map((itemLogList: ItemLogDto[]): ItemLogDto[] => {
      return itemLogList.filter((itemLog: ItemLogDto) => {
        return item.id === itemLog.itemId;
      });
    }));
  }

  public save(item: ItemDto): Observable<ItemDto> {
    return this.db.itemRepository.save(item);
  }

  public saveLog(item: ItemDto, itemLogType: ItemLogTypeDto): Observable<void> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.db.itemLogRepository.save({
      id: null,
      itemId: item.id,
      type: itemLogType,
      createdAt: new Date(),
    }).pipe(map((_: ItemLogDto): void => {
    }));
  }

  private isLogged(item: ItemDto, itemLogType: ItemLogTypeDto): Observable<boolean> {
    return this.itemLogList(item).pipe(
      map((itemLogList: ItemLogDto[]): boolean => {
        return itemLogList.find((itemLog: ItemLogDto): boolean => {
          return itemLog.type === itemLogType;
        }) !== undefined;
      }),
    );
  }

  private isLoggedSinceToday(item: ItemDto, itemLogType: ItemLogTypeDto): Observable<boolean> {
    const now: Date = new Date();
    const today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return this.itemLogList(item).pipe(
      map((itemLogList: ItemLogDto[]): boolean => {
        return itemLogList.find((itemLog: ItemLogDto): boolean => {
          return itemLog.type === itemLogType
            && itemLog.createdAt !== null
            && itemLog.createdAt.getTime() >= today.getTime();
        }) !== undefined;
      }),
    );
  }

}
