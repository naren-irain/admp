import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionComponent } from './transaction/transaction.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './login/login.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MomentModule } from 'ngx-moment';
import { AgGridModule } from 'ag-grid-angular';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { EditTransactionComponent } from './edit-transaction/edit-transaction.component';
import { PendingComponent } from './pending/pending.component';
import { SubmitTransactionComponent } from './submit-transaction/submit-transaction.component';
import { ViewAllTransactionComponent } from './view-all-transaction/view-all-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    LoginComponent,
    AppHeaderComponent,
    ViewTransactionComponent,
    EditTransactionComponent,
    PendingComponent,
    SubmitTransactionComponent,
    ViewAllTransactionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    MomentModule.forRoot(),
    AgGridModule
  ],
  exports: [],
  providers: [
    MatNativeDateModule,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
