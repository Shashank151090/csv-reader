import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { FileUtil } from './test/file.util';
import { filterPipe } from './test/test.pipe'
import { ApiService } from './api.service';
import { HttpClientModule  } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    filterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [FileUtil, filterPipe, ApiService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
