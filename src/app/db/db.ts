import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import { map, mergeMap } from "rxjs/operators";
import Dexie from "dexie";

import { ItemDto } from "../dtos/item/item.dto";

@Injectable({
  providedIn: "root",
})
export class Db {

  public readonly itemRepository: Repository<ItemDto>;

  private db: Dexie;

  public constructor() {
    this.db = new Dexie("db");
    this.migrate();

    this.itemRepository = this.newRepository("item", ["description", "title"]);
  }

  private migrate(): void {
    this.db.version(1).stores({ item: "++id" });
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
        return fromPromise(
          self.db.table(tableName).delete(id)
        );
      }

      findAll(): Observable<T[]> {
        return fromPromise(
          self.db.table(tableName).toArray()
        ).pipe(map((value: any[]): T[] => {
          return value.map((v: any): T => {
            return db2dto(v);
          });
        }));
      }

      findById(id: number): Observable<T | null> {
        return fromPromise(
          self.db.table(tableName).where("id").equals(id).first()
        ).pipe(map((value: any): T => {
          if (value === undefined) {
            return null;
          }
          return db2dto(value);
        }));
      }

      save(dto: T): Observable<T> {
        return fromPromise(
          self.db.table(tableName).put(dto2db(dto))
        ).pipe(mergeMap(this.findById), map((value: T | null): T => {
          if (value === null) {
            throw "cannot found saved data";
          }
          return value;
        }));
      }

    };
  }

}

interface Repository<T> {

  deleteById(id: number): Observable<void>;

  findAll(): Observable<T[]>;

  findById(id: number): Observable<T | null>;

  save(dto: T): Observable<T>;

}
