import { Injectable } from "@angular/core";
import { defer, from, Observable, ObservableInput } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import Dexie from "dexie";

import { ItemDto } from "../dtos/item/item.dto";
import { ItemLogDto } from "../dtos/item-log/item-log.dto";

@Injectable({
  providedIn: "root",
})
export class Db {

  public readonly itemRepository: Repository<ItemDto>;

  public readonly itemLogRepository: Repository<ItemLogDto>;

  private db: Dexie;

  public constructor() {
    this.db = new Dexie("db");
    this.migrate();

    this.itemRepository = this.newRepository("item", ["title", "description"]);
    this.itemLogRepository = this.newRepository("itemLog", ["itemId", "type", "createdAt"]);
  }

  private migrate(): void {
    this.db.version(1).stores({ item: "++id" });
    this.db.version(2).stores({ itemLog: "++id" });
  }

  private newRepository<T>(tableName: string, attrs: string[]): Repository<T> {
    const self: Db = this;

    const db2dto = (db: any): any => {
      return attrs.concat(["id"]).reduce((v: any, attr: string): any => {
        v[attr] = (db[attr] === undefined ? null : db[attr]);
        return v;
      }, {});
    };

    const dto2db = (dto: any): any => {
      return attrs.concat(["id"]).filter((attr: string): boolean => {
        return dto[attr] !== undefined && dto[attr] !== null;
      }).reduce((v: any, attr: string): any => {
        v[attr] = dto[attr];
        return v;
      }, {});
    };

    return new class implements Repository<T> {

      deleteById(id: number): Observable<void> {
        return defer((): ObservableInput<void> => {
          return from(self.db.table(tableName).delete(id));
        });
      }

      findAll(): Observable<T[]> {
        return defer((): ObservableInput<T[]> => {
          return from(self.db.table(tableName).toArray());
        }).pipe(map((value: any[]): T[] => {
          return value.map((v: any): T => {
            return db2dto(v);
          });
        }));
      }

      findById(id: number): Observable<T | null> {
        return defer((): ObservableInput<T | null> => {
          return from(self.db.table(tableName).where("id").equals(id).first());
        }).pipe(map((value: any): T => {
          if (value === undefined) {
            return null;
          }
          return db2dto(value);
        }));
      }

      save(dto: T): Observable<T> {
        return defer((): ObservableInput<number> => {
          return from(self.db.table(tableName).put(dto2db(dto)));
        }).pipe(mergeMap(this.findById), map((value: T | null): T => {
          if (value === null) {
            throw new Error("cannot find saved data");
          }
          return value;
        }));
      }

    }();
  }

}

interface Repository<T> {

  deleteById(id: number): Observable<void>;

  findAll(): Observable<T[]>;

  findById(id: number): Observable<T | null>;

  save(dto: T): Observable<T>;

}
