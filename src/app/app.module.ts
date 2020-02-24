import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./components/app/app.component";
import { LayoutMainComponent } from "./components/layout-main/layout-main.component";
import { PageHomeComponent } from "./components/page-home/page-home.component";
import { PageItemComponent } from "./components/page-item/page-item.component";
import { PageItemListComponent } from "./components/page-item-list/page-item-list.component";

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  declarations: [
    AppComponent,
    LayoutMainComponent,
    PageHomeComponent,
    PageItemComponent,
    PageItemListComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatCardModule,
    MatTabsModule,
    MatToolbarModule,
    RouterModule.forRoot([
      { path: "", component: PageHomeComponent },
      { path: "item/:id", component: PageItemComponent },
      { path: "item-list", component: PageItemListComponent },
    ]),
  ],
  providers: [
  ],
})
export class AppModule {
}
