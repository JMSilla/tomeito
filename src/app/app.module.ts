import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { TomeitoComponent } from './tomeito/tomeito.component';
import { NgxElectronModule } from 'ngx-electron';
import { ConfigComponent } from './config/component/config.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "config", component: ConfigComponent},
  { path: "**", component: TomeitoComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    TomeitoComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    NgxElectronModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
