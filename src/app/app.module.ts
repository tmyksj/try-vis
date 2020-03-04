import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";

import { environment } from "../environments/environment";
import { AppComponent } from "./components/app/app.component";
import { LayoutMainComponent } from "./components/layout-main/layout-main.component";
import { PageErrorComponent } from "./components/page-error/page-error.component";
import { PageHomeComponent } from "./components/page-home/page-home.component";
import { PageItemComponent } from "./components/page-item/page-item.component";
import { PageItemEditComponent } from "./components/page-item-edit/page-item-edit.component";
import { PageItemListComponent } from "./components/page-item-list/page-item-list.component";
import { PartItemListComponent } from "./components/part-item-list/part-item-list.component";

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  declarations: [
    AppComponent,
    LayoutMainComponent,
    PageErrorComponent,
    PageHomeComponent,
    PageItemComponent,
    PageItemEditComponent,
    PageItemListComponent,
    PartItemListComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule.forRoot([
      { path: "", component: PageHomeComponent },
      { path: "items", component: PageItemListComponent },
      { path: "items/activity", component: PageItemListComponent },
      { path: "items/new", component: PageItemEditComponent },
      { path: "items/:id", component: PageItemComponent },
      { path: "items/:id/edit", component: PageItemEditComponent },
      { path: "**", component: PageErrorComponent },
    ]),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
  ],
})
export class AppModule {
}
