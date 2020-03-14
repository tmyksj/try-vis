import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Chart } from "chart.js";

import { ItemDomain } from "../../domains/item/item.domain";
import { ItemDto } from "../../dtos/item/item.dto";

@Component({
  selector: "app-page-home",
  styleUrls: ["./page-home.component.scss"],
  templateUrl: "./page-home.component.html",
})
export class PageHomeComponent implements AfterViewInit, OnInit {

  public recommendedItemList: ItemDto[];

  public steps: number;

  @ViewChild("canvas")
  private canvas: ElementRef;

  private chart: Chart;

  private itemDomain: ItemDomain;

  public constructor(itemDomain: ItemDomain) {
    this.itemDomain = itemDomain;
  }

  public ngAfterViewInit(): void {
    const element: any = this.canvas.nativeElement;
    if (!(element instanceof HTMLCanvasElement)) {
      return;
    }

    const context: CanvasRenderingContext2D | null = element.getContext("2d");
    if (context === null) {
      return;
    }

    this.itemDomain.accumulateDailyStepsIntegrally().subscribe((dailySteps: [Date, number][]): void => {
      this.chart = new Chart(context, {
        data: {
          datasets: [
            {
              data: dailySteps.map((dailyStep: [Date, number]): { x: Date, y: number } => {
                return {
                  x: dailyStep[0],
                  y: dailyStep[1],
                };
              }),
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  unit: "day",
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
        type: "line",
      });
    });
  }

  public ngOnInit(): void {
    this.itemDomain.accumulateSteps().subscribe((steps: number): void => {
      this.steps = steps;
    });

    this.itemDomain.pickupRecommendedItemList().subscribe((itemList: ItemDto[]): void => {
      this.recommendedItemList = itemList.sort((a: ItemDto, b: ItemDto): number => {
        return b.id - a.id;
      });
    });
  }

}
