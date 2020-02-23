import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./components/app/app.component";
import { PageHomeComponent } from "./components/page-home/page-home.component";
import { PageItemComponent } from './components/page-item/page-item.component';

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  declarations: [
    AppComponent,
    PageHomeComponent,
    PageItemComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: PageHomeComponent },
    ]),
  ],
  providers: [
  ],
})
export class AppModule {
}
