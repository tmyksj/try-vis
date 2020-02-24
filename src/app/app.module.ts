import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./components/app/app.component";
import { PageHomeComponent } from "./components/page-home/page-home.component";
import { PageItemComponent } from "./components/page-item/page-item.component";
import { PageItemListComponent } from "./components/page-item-list/page-item-list.component";
import { LayoutMainComponent } from './components/layout-main/layout-main.component';

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  declarations: [
    AppComponent,
    PageHomeComponent,
    PageItemComponent,
    PageItemListComponent,
    LayoutMainComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
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
