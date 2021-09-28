import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { GuruComponent } from './guru/guru.component';
import { SiswaComponent } from './siswa/siswa.component';
import { KelasComponent } from './kelas/kelas.component';
import { RaportComponent } from './raport/raport.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { HasilComponent } from './hasil/hasil.component';

@NgModule({
  declarations: [
    AppComponent,
    GuruComponent,
    SiswaComponent,
    KelasComponent,
    RaportComponent,
    DashboardComponent,
    HomeComponent,
    HasilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FilterPipeModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
