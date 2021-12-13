import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatVideoModule } from "mat-video";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatMenuModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatGridListModule,
  MatTableModule,
  MatOptionModule,
  MatSelectModule,
  MatProgressBarModule,
  MatSortModule,
} from "@angular/material";

import { AppComponent } from "./app.component";
import { HeaderSideMenuComponent } from "./header-side-menu/header-side-menu.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { AppRoutingModule } from "./app-routing.module";
import { DashboardComponent } from "./dashboard-component/dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderSideMenuComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatGridListModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatVideoModule,
    MatSortModule,
    MatProgressBarModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent], // allow component to be used in all component parts (for example in HTML) and not just in other modules
})
export class AppModule {}
