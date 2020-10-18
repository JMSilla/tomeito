import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { TomeitoComponent } from './tomeito/tomeito.component';

const routes: Routes = [
  {path: "**", component: TomeitoComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    TomeitoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
