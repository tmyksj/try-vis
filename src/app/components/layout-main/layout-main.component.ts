import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-layout-main",
  styleUrls: ["./layout-main.component.scss"],
  templateUrl: "./layout-main.component.html",
})
export class LayoutMainComponent implements OnInit {

  @Input()
  public navEnabled: boolean;

  @Input()
  public toolbarTitle: string;

  public url: string;

  private router: Router;

  public constructor(router: Router) {
    this.router = router;

    this.navEnabled = true;
    this.toolbarTitle = "try-vis";
  }

  public ngOnInit(): void {
    this.url = this.router.url;
  }

}
