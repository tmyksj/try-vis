import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-layout-main",
  styleUrls: ["./layout-main.component.scss"],
  templateUrl: "./layout-main.component.html",
})
export class LayoutMainComponent implements OnInit {

  @Input()
  public navActiveLink: string;

  @Input()
  public navEnabled: boolean;

  @Input()
  public toolbarTitle: string;

  public constructor() {
    this.navActiveLink = "";
    this.navEnabled = true;
    this.toolbarTitle = "try-vis";
  }

  public ngOnInit(): void {
  }

}
