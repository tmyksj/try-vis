import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./components/app/app.component";
import { LayoutMainComponent } from "./components/layout-main/layout-main.component";
import { PageHomeComponent } from "./components/page-home/page-home.component";
import { PageItemComponent } from "./components/page-item/page-item.component";
import { PageItemListComponent } from "./components/page-item-list/page-item-list.component";
import { PageItemEditComponent } from './components/page-item-edit/page-item-edit.component';

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
    PageItemEditComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatToolbarModule,
    RouterModule.forRoot([
      { path: "", component: PageHomeComponent },
      { path: "items", component: PageItemListComponent },
      { path: "items/:id", component: PageItemComponent },
    ]),
  ],
  providers: [
  ],
})
export class AppModule {
}
