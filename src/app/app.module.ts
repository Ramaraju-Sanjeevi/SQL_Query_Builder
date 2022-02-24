import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { CustomerService } from './customservices/customerservice.service';
import { TableDataServiceService } from './customservices/table-data-service.service'
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule,
    AppRoutingModule, HttpClientModule,
    DropdownModule, TableModule, InputTextModule, ButtonModule, CardModule
  ],
  providers: [CustomerService, TableDataServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
