import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";

@Component({
  selector: "app-page-item-edit",
  styleUrls: ["./page-item-edit.component.scss"],
  templateUrl: "./page-item-edit.component.html",
})
export class PageItemEditComponent implements OnInit {

  public item: ItemDto;

  public varTitle: string;

  public varDescription: string;

  private itemDomain: ItemDomain;

  private route: ActivatedRoute;

  private router: Router;

  public constructor(itemDomain: ItemDomain, route: ActivatedRoute, router: Router) {
    this.itemDomain = itemDomain;
    this.route = route;
    this.router = router;
  }

  public ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap): Observable<ItemDto> => {
        if (params.has("id")) {
          return this.itemDomain.item(parseInt(params.get("id"), 10));
        }

        return of({
          id: null,
          title: "",
          description: "",
        });
      }),
      map((item: ItemDto | null): ItemDto => {
        if (item === null) {
          throw new Error("cannot find item");
        }
        return item;
      }),
    ).subscribe((item: ItemDto): void => {
      this.item = item;
      this.varTitle = item.title;
      this.varDescription = item.description;
    }, (_: any): void => {
      // TODO: redirect
      // this.router.navigateByUrl("/404");
    });
  }

  public onSubmit(): void {
    this.itemDomain.save({
      id: this.item.id,
      title: this.varTitle,
      description: this.varDescription,
    }).subscribe((_: ItemDto): void => {
      this.router.navigateByUrl("/");
    });
  }

}
