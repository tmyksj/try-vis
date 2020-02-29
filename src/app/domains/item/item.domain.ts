import { Injectable } from "@angular/core";
import { combineLatest, forkJoin, from, Observable, ObservableInput, of, throwError } from "rxjs";
import { filter, map, mergeMap, startWith, toArray } from "rxjs/operators";

import { ItemDto } from "../../dtos/item/item.dto";
import { ItemLogDto } from "../../dtos/item-log/item-log.dto";
import { ItemLogTypeDto } from "../../dtos/item-log-type/item-log-type.dto";
import { IndexedDbInfrastructure } from "../../infrastructures/indexed-db/indexed-db.infrastructure";

@Injectable({
  providedIn: "root",
})
export class ItemDomain {

  private indexedDb: IndexedDbInfrastructure;

  public constructor(indexedDb: IndexedDbInfrastructure) {
    this.indexedDb = indexedDb;
  }

  public accumulateSteps(): Observable<number> {
    return this.indexedDb.itemLogRepository.findAll().pipe(
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
    return this.itemList().pipe(
      mergeMap((itemList: ItemDto[]): Observable<ItemDto> => {
        return from(itemList);
      }),
      mergeMap((item: ItemDto): Observable<[ItemDto, boolean, Date]> => {
        return combineLatest([
          of(item),
          this.isLoggable(item, ItemLogTypeDto.DoneToday),
          this.itemLogList(item).pipe(
            map((itemLogList: ItemLogDto[]): Date => {
              return itemLogList.reduce((previousValue: Date, currentValue: ItemLogDto): Date => {
                  if (currentValue.createdAt !== null && previousValue.getTime() < currentValue.createdAt.getTime()) {
                    return currentValue.createdAt;
                  }
                  return previousValue;
              }, new Date(0));
            }),
          ),
        ]);
      }),
      filter((value: [ItemDto, boolean, Date]): boolean => {
        return value[1];
      }),
      toArray<[ItemDto, boolean, Date]>(),
      map((value: [ItemDto, boolean, Date][]): ItemDto[] => {
        return value.sort((a: [ItemDto, boolean, Date], b: [ItemDto, boolean, Date]): number => {
          return a[2].getTime() - b[2].getTime();
        }).map((v: [ItemDto, boolean, Date]): ItemDto => {
          return v[0];
        }).slice(0, 3);
      }),
    );
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
      this.indexedDb.itemRepository.deleteById(item.id),
      this.indexedDb.itemLogRepository.findAll().pipe(
        mergeMap((itemLogList: ItemLogDto[]): ObservableInput<ItemLogDto> => {
          return from(itemLogList);
        }),
        filter((itemLog: ItemLogDto): boolean => {
          return item.id === itemLog.itemId;
        }),
        mergeMap((itemLog: ItemLogDto): ObservableInput<void> => {
          return this.indexedDb.itemLogRepository.deleteById(itemLog.id);
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

    return this.indexedDb.itemLogRepository.deleteById(itemLog.id);
  }

  public item(id: number): Observable<ItemDto | null> {
    return this.indexedDb.itemRepository.findById(id);
  }

  public itemList(): Observable<ItemDto[]> {
    return this.indexedDb.itemRepository.findAll();
  }

  public itemLog(item: ItemDto, id: number): Observable<ItemLogDto | null> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.indexedDb.itemLogRepository.findById(id).pipe(map((itemLog: ItemLogDto | null): ItemLogDto | null => {
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

    return this.indexedDb.itemLogRepository.findAll().pipe(map((itemLogList: ItemLogDto[]): ItemLogDto[] => {
      return itemLogList.filter((itemLog: ItemLogDto) => {
        return item.id === itemLog.itemId;
      });
    }));
  }

  public save(item: ItemDto): Observable<ItemDto> {
    return this.indexedDb.itemRepository.save(item);
  }

  public saveLog(item: ItemDto, itemLogType: ItemLogTypeDto): Observable<void> {
    if (item.id === null) {
      return throwError(new Error("item.id must not be null"));
    }

    return this.indexedDb.itemLogRepository.save({
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
