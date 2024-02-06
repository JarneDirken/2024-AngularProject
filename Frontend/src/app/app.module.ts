import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthModule } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import { TripListComponent } from './pages/trip-list/trip-list.component';
import { TripFormComponent } from './pages/trip-form/trip-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { TripComponent } from './pages/trip/trip.component';
import { ActivityFormComponent } from './pages/activity-form/activity-form.component';
import { TripPublicListComponent } from './pages/trip-public-list/trip-public-list.component';
import { InviteFormComponent } from './components/invite-form/invite-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ErrorComponent } from './pages/error/error.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';;
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FooterComponent,
    NavbarComponent,
    ContactComponent,
    UserProfileComponent,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    AuthModule.forRoot({
      domain: environment.AUTH0_DOMAIN,
      clientId: environment.AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.AUTH0_AUDIENCE,
      },
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          `${environment.api_url}/Trip`,
          `${environment.api_url}/Trip/*`,
        ],
      },
    }),
    
    FormsModule,
    TripComponent,
    DatePipe,
    TripListComponent,
    ActivityFormComponent,
    InviteFormComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    TripFormComponent,
    ErrorComponent,
    MatTooltipModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
